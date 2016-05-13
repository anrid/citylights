'use strict'

const P = require('bluebird')
const Mongoose = require('mongoose')

function connect () {
  Mongoose.Promise = P
  P.promisifyAll(Mongoose)
  P.promisifyAll(Mongoose.Model)

  const isTest = process.env.NODE_ENV === 'test'

  let host = process.env.CITYLIGHTS_MONGO_HOST || 'localhost'
  let port = process.env.CITYLIGHTS_MONGO_PORT || '27017'
  let db = isTest ? 'test_dev' : process.env.CITYLIGHTS_MONGO_DB || 'test_dev'
  let user = process.env.CITYLIGHTS_MONGO_USER
  let pass = process.env.CITYLIGHTS_MONGO_PASS

  let url = `mongodb://${host}:${port}/${db}`

  const opts = {
    db: { native_parser: true },
    server: isTest ? { } : { poolSize: 5 }
  }
  if (user && pass) {
    opts.user = user
    opts.pass = pass
    url = url.replace('mongodb://', `mongodb://${user}:${pass}@`)
    if (user === 'admin') {
      url += '?authSource=admin'
    }
  }
  // console.log('Connecting to MongoDB url:', url)

  Mongoose.set('debug', false)
  Mongoose.connection.on('error',
    console.error.bind(console, 'MongoDB: connection error,')
  )
  Mongoose.connection.once('open',
    console.log.bind(console, 'MongoDB: connected to', url)
  )
  Mongoose.connect(url, opts)
}

module.exports = connect
