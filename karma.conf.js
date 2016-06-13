'use strict'

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
      devtool: 'eval-cheap-module-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
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
