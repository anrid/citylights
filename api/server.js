import 'dotenv/config'
import * as Hoek from '@hapi/hoek'
import * as Hapi from '@hapi/hapi'
import path from 'path'
import fs from 'fs'
import chalk from 'chalk'
import moment from 'moment'
import qs from 'qs'
import url from 'url'

const Fs = fs.promises

// Railway will handle TLS, so we only need port configuration
const port = process.env.PORT || process.env.CITYLIGHTS_PORT || 3001
const host = process.env.HOST || process.env.CITYLIGHTS_HOST || '0.0.0.0'
// Hoek.assert(process.env.CITYLIGHTS_MONGO_DB, 'Missing env `CITYLIGHTS_MONGO_DB`')
// Hoek.assert(process.env.CITYLIGHTS_MONGO_USER, 'Missing env `CITYLIGHTS_MONGO_USER`')
// Hoek.assert(process.env.CITYLIGHTS_MONGO_PASS, 'Missing env `CITYLIGHTS_MONGO_PASS`')
if (!process.env.CITYLIGHTS_CDN) {
  console.log('Env `CITYLIGHTS_CDN` not set')
}

const isProduction = process.env.NODE_ENV === 'production'

// Modern async/await server initialization
async function initServer() {
  try {
    const manifest = await preStart()
    const server = createServer()
    await registerPlugins(server)
    await setupViews(server, manifest)
    await setupRoutes(server)
    await startServer(server)
    return server
  } catch (error) {
    console.error('Error:', error, error.stack)
    throw error
  }
}

export default initServer()

async function preStart() {
  try {
    // Initialize the database
    const database = await import('./lib/database.js')
    await database.default()

    if (isProduction) {
      const packageJson = await import('../package.json', { with: { type: 'json' } })
      const version = packageJson.default.version
      const Https = await import('./lib/https.js')
      const manifestUrl = `${process.env.CITYLIGHTS_CDN}/assets/release-manifest-${version}.json`
      const json = await Https.default.fetchGzipped(manifestUrl)
      const manifest = JSON.parse(json)
      
      Hoek.assert(manifest &&
        manifest.assets &&
        manifest.items.length,
        'Fetched invalid manifest: ' + JSON.stringify(manifest, false, 2)
      )
      
      console.log('Loaded app manifest:', manifest)
      return manifest
    }
    
    console.log('Prestart complete.')
    return null
  } catch (error) {
    console.error('Prestart failed:', error)
    throw error
  }
}

function createServer() {
  // Simple Hapi v21 server for Railway deployment
  const serverOptions = {
    port: port,
    host: host,
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    }
  }

  const server = new Hapi.Server(serverOptions)

  // Modern Hapi v21 extension with toolkit  
  server.ext('onRequest', (request, h) => {
    const uri = request.raw.req.url
    try {
      const urlObj = new URL(uri, `http://${host}:${port}`)
      const queryObject = qs.parse(urlObj.search.slice(1)) // Remove '?' from search
      
      // Create properly formatted URL for Hapi v21
      const newUrl = {
        pathname: urlObj.pathname,
        search: urlObj.search,
        query: queryObject
      }
      
      request.setUrl(newUrl)
    } catch (error) {
      console.warn('URL parsing error:', error.message, 'for URL:', uri)
    }
    return h.continue
  })

  return server
}

async function registerPlugins(server) {
  const vision = await import('@hapi/vision')
  const inert = await import('@hapi/inert')
  
  const plugins = [
    vision.default,
    inert.default
  ]

  await server.register(plugins)
}

async function setupViews(server, manifest) {
  console.log('Setting up views.')

  const context = setupDefaultViewContext(server, manifest)
  console.log('Using default view context:', JSON.stringify(context, false, 2))

  const handlebars = await import('handlebars')
  
  server.views({
    engines: {
      html: handlebars.default
    },
    relativeTo: path.dirname(new URL(import.meta.url).pathname),
    path: 'views',
    context
  })
}

function setupDefaultViewContext (server, manifest) {
  const context = {
    apiServer: server.info.uri,
    version: process.env.npm_package_version,
    cdn: process.env.CITYLIGHTS_CDN || '',
    js: { }
  }

  if (isProduction) {
    const assets = manifest.assets
    // TODO: Don’t rely on manifest file order !
    context.js = {
      manifest: context.cdn + assets.manifest.js,
      vendors: context.cdn + assets.vendors.js,
      app: context.cdn + assets.app.js
    }
  }
  return context
}

async function setupRoutes(server) {
  console.log('Setting up routes.')

  // Static file serving for production build
  if (isProduction) {
    server.route({
      method: 'GET',
      path: '/assets/{file*}',
      handler: {
        directory: {
          path: path.join(path.dirname(new URL(import.meta.url).pathname), '../build/assets')
        }
      }
    })
  }

  // SPA fallback route
  server.route({
    method: 'GET',
    path: '/{path*}',
    options: { 
      cors: true 
    },
    handler(request, h) {
      console.log(`[${request.path}]`, moment().format())

      // Serve the built app in production mode!
      if (isProduction) {
        return h.file(path.join(path.dirname(new URL(import.meta.url).pathname), '../build/index.html'))
      }
      // Take a chill pill otherwise.
      return `Server in dev mode.\n\nStay a while, and Listen.`
    }
  })

  // Setup Socket API.
  const socket = await import('./lib/socket.js')
  socket.default(server)
}

async function startServer(server) {
  console.log('Starting server.')

  // In ES modules, directly start the server since this is the entry point
  try {
    await server.start()
    
    // Print all registered routes
    server.table().forEach((route) => {
      console.log(`${route.method.toUpperCase()} ${route.path}`)
    })
    
    console.log('API server running at:', server.info.uri)
    console.log('API server mode:', process.env.NODE_ENV || '`NODE_ENV` not set.')
  } catch (error) {
    console.error('Error starting server:', error, error.stack)
    throw error
  }
}
