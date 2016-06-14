'use strict'

const Path = require('path')
const APP_DIR = Path.join(__dirname, 'app')

module.exports = function (config) {
  // Rock on.
  config.set({
    browsers: [ process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'Chrome' ],
    singleRun: true,
    frameworks: [ 'mocha' ],
    files: [
      'testsEntry.webpack.js'
    ],
    preprocessors: {
      'testsEntry.webpack.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'dots' ],
    webpack: {
      // `devtool: 'eval'` or `devtool: 'inline-source-map'`
      // and `output.pathinfo: true` work together to give us
      // sensible error messages.
      devtool: 'eval', // 'inline-source-map'
      output: {
        pathinfo: true
      },
      module: {
        loaders: [
          // CSS and SCSS.
          {
            test: /\.css$/,
            loader: 'style!css',
            include: APP_DIR
          },
          {
            test: /\.scss$/,
            loader: 'style!css!sass',
            include: APP_DIR
          },
          {
            test: /\.js$/,
            loader: 'babel-loader',
            include: APP_DIR,
            query: {
              presets: ['react', 'es2015', 'stage-0'],
              cacheDirectory: true
            }
          }
        ]
      }
    },
    webpackServer: {
      noInfo: false,
      quiet: true,
      stats: { colors: true }
    }
  })
}
