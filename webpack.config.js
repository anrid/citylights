'use strict'

const Webpack = require('webpack')
const Path = require('path')
const Fs = require('fs')
const Chalk = require('chalk')

const HtmlPlugin = require('html-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin') // Version 7.1.1 should be Webpack 5 compatible

const TARGET = process.env.npm_lifecycle_event || '(no target)'
const API_HOST = process.env.SKIP_TLS ? 'devbox.citylights.io' : process.env.CITYLIGHTS_HOST
const API_PORT = process.env.CITYLIGHTS_PORT

const production = TARGET.match(/build/)
const startServer = TARGET.match(/dev/)
// Webpack 5 recommends [contenthash] for long-term caching.
const filename = production ? '[name]-[contenthash:10].js' : '[name]-[fullhash:10].js' // Using contenthash for prod
const version = process.env.npm_package_version

const PATHS = {
  app: Path.join(__dirname, 'app'),
  build: Path.join(__dirname, 'build')
}

const config = {
  mode: production ? 'production' : 'development',
  entry: {
    app: PATHS.app,
    // CSS (e.g., medium-font.css) should be imported from within your JavaScript files (e.g., app/index.js)
    // or handled via a dedicated CSS entry point if using mini-css-extract-plugin extensively.
    // Removing it from here as it's not standard for JS vendor chunk.
    vendors: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'react-router-redux',
      'react-motion',
      'react-draggable',
      'react-resizable',
      'bson-objectid',
      'moment',
      'bluebird',
      'reselect',
      'metaphone',
      'draft-js'
      // Removed: Path.join(PATHS.app, 'styles', 'medium-font.css')
    ]
  },
  output: {
    path: PATHS.build,
    filename,
    pathinfo: !production, // true in development for more info, false in production
    publicPath: production ? '/assets/' : '/',
    clean: production // Clean the output directory before emit in production
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/, // Selects modules from node_modules
          chunks: 'all',
          // Including the CSS here might not work as expected with splitChunks
          // as it's primarily for JS. If medium-font.css is truly a vendor style,
          // it might be better to import it in a vendor JS file or handle CSS extraction separately.
        },
      },
    },
    runtimeChunk: { // Extracts webpack runtime & manifest into a separate file
      name: 'manifest'
    },
    // Minification is handled by default in production mode in Webpack 5 (using Terser)
    // UglifyJsPlugin is removed.
  },
  plugins: [
    // CommonsChunkPlugin is removed, replaced by optimization.splitChunks
    new HtmlPlugin({
      title: 'Test App',
      host: `${API_HOST}:${API_PORT}`,
      template: Path.join(PATHS.app, 'public', 'dev.html'),
      inject: 'body'
    })
    // DefinePlugin for NODE_ENV is handled by `mode` option.
  ],
  module: {
    // `module.loaders` is replaced by `module.rules`
    rules: getLoaders()
  },
  // devtool should be configured based on needs, 'source-map' for prod, 'eval-source-map' for dev
  devtool: production ? 'source-map' : 'eval-source-map', 
}

if (production) {
  config.plugins = config.plugins.concat([
    new AssetsPlugin({ filename: 'manifest.json', path: PATHS.build, fullPath: false })
    // OccurenceOrderPlugin, DedupePlugin, UglifyJsPlugin are implicitly handled or replaced in Webpack 5.
  ])
  // If specific Terser options are needed:
  // config.optimization.minimizer = [
  //   new TerserPlugin({
  //     terserOptions: {
  //       compress: { warnings: false },
  //       output: { comments: false },
  //     },
  //     sourceMap: true, // if you want source maps for minified code
  //   }),
  // ];
}

if (startServer) {
  console.log('Running webpack-dev-server.')
  config.devServer = {
    historyApiFallback: true,
    static: { // replaces contentBase
      directory: PATHS.build,
    },
    hot: true,
    // inline: true, // true by default with webpack-dev-server v4+
    // progress: true, // deprecated
    headers: { 'X-Awesome': 'yes' },
    stats: 'errors-only', // Webpack 5 has 'errors-only', 'minimal', 'normal', 'verbose'
    host: '0.0.0.0',
    port: 8999
  }

  if (!process.env.SKIP_TLS) {
    Object.assign(config.devServer, {
      server: { // https options are now nested under 'server'
        type: 'https',
        options: {
          key: Fs.readFileSync(process.env.CITYLIGHTS_PRIVKEY, 'utf8'),
          cert: Fs.readFileSync(process.env.CITYLIGHTS_CERT, 'utf8'),
          ca: Fs.readFileSync(process.env.CITYLIGHTS_CA, 'utf8'), // Changed cacert to ca
        }
      },
      // host: process.env.CITYLIGHTS_HOST // This should be set if different from general host
    })
  } else {
    console.log(Chalk.bgYellow.black('Webpack Dev Server is NOT using HTTPS'))
  }

  // HotModuleReplacementPlugin is often auto-added with hot:true in devServer, but explicit is fine.
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
      use: ['style-loader', 'css-loader'], // Replaces `loader: 'style!css'`
      include: PATHS.app
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'], // Replaces `loader: 'style!css!sass'`
      include: PATHS.app
    },
    // Babel all JavaScript.
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader', // Explicitly 'babel-loader'
      include: [PATHS.app], // Removed PATHS.build, not typical to include build output here
      options: { // `query` is now `options`
        // Presets need to be updated for Babel 7+ (installed in package.json)
        // Assuming @babel/preset-env, @babel/preset-react are installed.
        // babel-preset-stage-0 is deprecated; features should be checked.
        presets: ['@babel/preset-react', '@babel/preset-env'],
        cacheDirectory: true
      }
    }
  ]
}
