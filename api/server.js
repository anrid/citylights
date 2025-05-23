'use strict'

const Hoek = require('@hapi/hoek')

Hoek.assert(process.env.CITYLIGHTS_PRIVKEY, 'Missing env `CITYLIGHTS_PRIVKEY`')
Hoek.assert(process.env.CITYLIGHTS_CERT, 'Missing env `CITYLIGHTS_CERT`')
Hoek.assert(process.env.CITYLIGHTS_CA, 'Missing env `CITYLIGHTS_CA`')
Hoek.assert(process.env.CITYLIGHTS_HOST, 'Missing env `CITYLIGHTS_HOST`')
Hoek.assert(process.env.CITYLIGHTS_PORT, 'Missing env `CITYLIGHTS_PORT`')
// Hoek.assert(process.env.CITYLIGHTS_MONGO_DB, 'Missing env `CITYLIGHTS_MONGO_DB`')
// Hoek.assert(process.env.CITYLIGHTS_MONGO_USER, 'Missing env `CITYLIGHTS_MONGO_USER`')
// Hoek.assert(process.env.CITYLIGHTS_MONGO_PASS, 'Missing env `CITYLIGHTS_MONGO_PASS`')
if (!process.env.CITYLIGHTS_CDN) {
  console.log('Env `CITYLIGHTS_CDN` not set')
}

const isProduction = process.env.NODE_ENV === 'production'

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const Path = require('path')
const Fs = require('fs')
const Chalk = require('chalk')
const Moment = require('moment')

const P = require('bluebird')
P.promisifyAll(Fs)

const Qs = require('qs')
const Url = require('url')

const init = async () => {
  const manifest = await preStart()
  const server = await createServer()
  await registerPlugins(server)
  setupViews(server, manifest)
  setupRoutes(server)
  await startServer(server)
  return server
}

preStart()
  .then(async (manifest) => {
    const serverOptions = {
      port: process.env.CITYLIGHTS_PORT,
      router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
      }
    }

    if (!process.env.SKIP_TLS) {
      serverOptions.host = process.env.CITYLIGHTS_HOST
      serverOptions.tls = {
        key: Fs.readFileSync(process.env.CITYLIGHTS_PRIVKEY),
        cert: Fs.readFileSync(process.env.CITYLIGHTS_CERT),
        ca: [Fs.readFileSync(process.env.CITYLIGHTS_CA)]
      }
    } else {
      console.log(Chalk.bgYellow.black('Hapi is NOT using HTTPS'))
    }

    const server = Hapi.server(serverOptions)

    // Switch out the querystring parser.
    // TODO: Modernize this Qs integration if possible, or verify if still needed.
    // For Hapi v17+, request.setUrl is gone. Query parameters are available via request.query.
    // If Qs is used for complex parsing not handled by Hapi's default (querystring module),
    // this needs to be handled differently, perhaps by parsing request.url.search directly.
    server.ext('onRequest', (request, h) => {
      const uri = request.raw.req.url
      const parsedUrl = Url.parse(uri, false) // Keep 'false' to parse query string as string
      if (parsedUrl.search) { // Only parse if there's a query string
        // Remove leading '?' before parsing with Qs
        request.query = Qs.parse(parsedUrl.search.substring(1))
      }
      // Hapi will use request.query for routing and handlers.
      // No direct equivalent for request.setUrl() for full path mutation before routing in Hapi v17+.
      // If full path mutation was intended, this needs a more complex solution.
      // For now, we're just augmenting request.query.
      return h.continue
    })

    await server.register([
      Inert,
      Vision
    ])

    setupViews(server, manifest)
    setupRoutes(server)

    if (!module.parent) {
      await server.start()
      console.log('API server running on %s', server.info.uri)
      server.table().forEach((route) => {
        console.log(`${route.method.toUpperCase()} ${route.path}`)
      })
      console.log('API server mode:', process.env.NODE_ENV || '`NODE_ENV` not set.')
    }
    return server
  })
  .catch((reason) => {
    console.error('Error starting server:', reason, reason.stack)
    process.exit(1)
  })

function preStart () {
  return P.try(() => {
    // Rock the DB.
    require('./lib/database')()

    if (isProduction) {
      const version = require('../package.json').version
      const Https = require('./lib/https') // This is a custom https library, not Node's https
      const manifestUrl = `${process.env.CITYLIGHTS_CDN}/assets/release-manifest-${version}.json`
      return Https.fetchGzipped(manifestUrl)
        .then((json) => {
          const manifest = JSON.parse(json)
          Hoek.assert(manifest &&
            manifest.assets &&
            manifest.items.length,
          'Fetched invalid manifest: ' + JSON.stringify(manifest, false, 2)
          )
          console.log('Loaded app manifest:', manifest)
          return manifest
        })
    }
    // Return a default or empty manifest structure if not production,
    // so setupViews has a consistent input.
    return { assets: {}, items: [] }
  })
  .tap(() => console.log('Prestart complete.'))
}

// createServer function is now integrated into the main async block

// registerPlugins function is now integrated into the main async block

function setupViews (server, manifest) {
  console.log('Setting up views.')

  const context = setupDefaultViewContext(server, manifest)
  console.log('Using default view context:', JSON.stringify(context, false, 2))

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
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

  // Ensure manifest and manifest.assets exist before trying to access them
  if (isProduction && manifest && manifest.assets) {
    const assets = manifest.assets
    // TODO: Don’t rely on manifest file order !
    context.js = {
      manifest: context.cdn + (assets.manifest ? assets.manifest.js : ''),
      vendors: context.cdn + (assets.vendors ? assets.vendors.js : ''),
      app: context.cdn + (assets.app ? assets.app.js : '')
    }
  }
  return context
}

function setupRoutes (server) {
  console.log('Setting up routes.')

  server.route({
    method: 'GET',
    path: '/',
    options: { cors: true }, // 'config' is now 'options'
    handler: async (request, h) => { // reply is now h (response toolkit)
      console.log('[/]', Moment().format())

      // Server the app in production mode !
      if (isProduction) {
        return h.view('app.html')
      }
      // Take a chill pill otherwise.
      return `Server in dev mode.\n\nStay a while, and Listen.`
    }
  })

  // Setup Socket API - this will need to be adapted if it relies on Hapi internals that changed
  // For now, assume it takes the server object and attaches to the http listener.
  require('./lib/socket')(server.listener)
}

// startServer function is now integrated into the main async block and module.parent check

// Export the init function for potential programmatic use or testing
module.exports = init()
