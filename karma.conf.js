'use strict'

const Path = require('path')
const APP_DIR = Path.join(__dirname, 'app')
const webpack = require('webpack')

module.exports = function (config) {
  // Rock on.
  config.set({
    browsers: [ process.env.CONTINUOUS_INTEGRATION ? 'Firefox' : 'ChromeHeadless' ],
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
        rules: [
          // CSS and SCSS.
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
            include: APP_DIR
          },
          {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: APP_DIR
          },
          {
            test: /\.js$/,
            loader: 'babel-loader',
            include: APP_DIR,
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
              cacheDirectory: true
            }
          }
        ]
      },
      resolve: {
        modules: ['node_modules'],
        fallback: {
          "fs": false, // or require.resolve("fs") if you need it
          "path": require.resolve("path-browserify"),
          "stream": require.resolve("stream-browserify"),
          "constants": require.resolve("constants-browserify"),
          "vm": require.resolve("vm-browserify"),
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "os": require.resolve("os-browserify/browser"),
          "buffer": require.resolve("buffer/"),
          "module": false,
          "assert": require.resolve("assert/"),
          "process/browser": require.resolve("process/browser"), // Ensure this specific path can be resolved if needed
          "url": false,
          "util": false,
          "zlib": false,
          "crypto": false,
          "tty": false,
          "child_process": false,
          "http2": false,
          "dns": false,
          "net": false,
          "tls": false,
          "repl": false,
          "dgram": false,
          "cluster": false,
          "readline": false,
          "perf_hooks": false,
          "async_hooks": false,
          "string_decoder": false,
          "diagnostics_channel": false,
          "worker_threads": false,
          "v8": false,
          "inspector": false
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer']
        }),
        new webpack.DefinePlugin({
          'process.stdout.isTTY': false
        })
      ]
      // REMOVING DUPLICATE RESOLVE CONFIGURATION
    },
    webpackServer: {
      noInfo: false,
      quiet: true,
      stats: { colors: true }
    }
  })
}
