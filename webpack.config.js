'use strict'

const Webpack = require('webpack')
const Path = require('path')
const Fs = require('fs')

const HtmlPlugin = require('html-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

const TARGET = process.env.npm_lifecycle_event || '(no target)'
const production = TARGET.match(/build/)
const startServer = TARGET.match(/dev/)
const filename = production ? '[name]-[chunkhash:10].js' : '[name]-[hash:10].js'
const version = process.env.npm_package_version

const PATHS = {
  app: Path.join(__dirname, 'app'),
  build: Path.join(__dirname, 'build')
}

const config = {
  entry: {
    app: PATHS.app,
    vendors: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'react-router-redux',
      'react-motion',
      'moment',
      'bluebird',
      Path.join(PATHS.app, 'styles', 'medium-font.css')
    ]
  },
  output: {
    path: PATHS.build,
    filename,
    pathinfo: true,
    publicPath: production ? '/assets/' : '/'
  },
  plugins: [
    new Webpack.optimize.CommonsChunkPlugin({ names: ['vendors', 'manifest'] }),
    new HtmlPlugin({
      title: 'Test App',
      template: Path.join(PATHS.app, 'public', 'dev.html'),
      inject: 'body'
    })
  ],
  module: {
    loaders: getLoaders()
  }
}

if (production) {
  config.plugins = config.plugins.concat([
    new AssetsPlugin({ filename: 'manifest.json', path: PATHS.build }),
    new Webpack.optimize.OccurenceOrderPlugin(),
    new Webpack.optimize.DedupePlugin(),
    new Webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      sourceMap: false
    }),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ])
}

if (startServer) {
  console.log('Running webpack-dev-server.')
  config.devServer = {
    historyApiFallback: true,
    contentBase: PATHS.build,
    hot: true,
    inline: true,
    progress: true,
    headers: { 'X-Awesome': 'yes' },
    // Keep it secret. Keep it safe.
    https: true,
    key: Fs.readFileSync(process.env.CITYLIGHTS_PRIVKEY, 'utf8'),
    cert: Fs.readFileSync(process.env.CITYLIGHTS_CERT, 'utf8'),
    cacert: [Fs.readFileSync(process.env.CITYLIGHTS_CA, 'utf8')],
    // Display only errors to reduce the amount of output.
    stats: 'errors-only',
    // Parse host and port from env so this is easy to customize.
    host: process.env.CITYLIGHTS_HOST,
    port: 8999
  }

  config.plugins = config.plugins.concat([
    new Webpack.HotModuleReplacementPlugin()
  ])
}

if (production) {
  console.log(`
  === Production / Release Build (Version: ${version}) ===
  `)
}
console.log('Entry:', JSON.stringify(config.entry, false, 2))
console.log('Output:', JSON.stringify(config.output, false, 2))

module.exports = config

function getLoaders () {
  return [
    // CSS and SCSS.
    {
      test: /\.css$/,
      loader: 'style!css',
      include: PATHS.app
    },
    {
      test: /\.scss$/,
      loader: 'style!css!sass',
      include: PATHS.app
    },
    // Babel all JavaScript.
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      include: [PATHS.app, PATHS.build],
      query: {
        presets: ['react', 'es2015', 'stage-0'],
        cacheDirectory: true
      }
    }
  ]
}
