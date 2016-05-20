'use strict'

const Hoek = require('hoek')

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

const Hapi = require('hapi')
const Path = require('path')
const Fs = require('fs')
const Chalk = require('chalk')
const Moment = require('moment')

const P = require('bluebird')
P.promisifyAll(Fs)

const Qs = require('qs')
const Url = require('url')

module.exports = preStart()
.then((manifest) => {
  const server = createServer()
  return registerPlugins(server)
  .then(() => {
    setupViews(server, manifest)
    setupRoutes(server)
    startServer(server)
    return server
  })
})
.catch((reason) => (
  console.error('Error:', reason, reason.stack)
))

function preStart () {
  return P.try(() => {
    // Rock the DB.
    require('./lib/database')()

    if (isProduction) {
      const version = require('../package.json').version
      const Https = require('./lib/https')
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
  })
  .tap(() => console.log('Prestart complete.'))
}

function createServer () {
  const s = new Hapi.Server({
    connections: {
      router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
      }
    }
  })

  if (!process.env.SKIP_TLS) {
    const tls = {
      key: Fs.readFileSync(process.env.CITYLIGHTS_PRIVKEY),
      cert: Fs.readFileSync(process.env.CITYLIGHTS_CERT),
      ca: [Fs.readFileSync(process.env.CITYLIGHTS_CA)]
    }
    s.connection({
      host: process.env.CITYLIGHTS_HOST,
      port: process.env.CITYLIGHTS_PORT,
      tls
    })
  } else {
    console.log(Chalk.bgYellow.black('Hapi is NOT using HTTPS'))
    s.connection({ port: process.env.CITYLIGHTS_PORT })
  }

  // Switch out the querystring parser.
  function onRequest (request, reply) {
    const uri = request.raw.req.url
    const parsed = Url.parse(uri, false)
    parsed.query = Qs.parse(parsed.query)
    request.setUrl(parsed)
    return reply.continue()
  }

  s.ext('onRequest', onRequest)

  return s
}

function registerPlugins (server) {
  const plugins = [
    require('vision'),
    require('inert')
  ]

  return server.register(plugins)
}

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

function setupRoutes (server) {
  console.log('Setting up routes.')

  server.route({
    method: 'GET',
    path: '/',
    config: { cors: true },
    handler (request, reply) {
      console.log('[/]', Moment().format())

      // Server the app in production mode !
      if (isProduction) {
        return reply.view('app.html')
      }
      // Take a chill pill otherwise.
      reply(`Server in dev mode.\n\nStay a while, and Listen.`)
    }
  })

  // Setup Socket API.
  require('./lib/socket')(server)
}

function startServer (server) {
  console.log('Starting server.')

  if (!module.parent) {
    server.start((err) => {
      if (err) {
        return console.error('Error:', err, err.stack)
      }

      server.table().forEach((x) => {
        x.table.forEach((y) => console.log(`${y.method.toUpperCase()} ${y.path}`))
      })
      console.log('API server running at:', server.info.uri)
      console.log('API server mode:', process.env.NODE_ENV || '`NODE_ENV` not set.')
    })
  }
}
