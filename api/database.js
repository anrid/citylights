'use strict'

const P = require('bluebird')
const Mongoose = require('mongoose')

function connect () {
  Mongoose.Promise = P
  P.promisifyAll(Mongoose)
  P.promisifyAll(Mongoose.Model)

  const host = process.env.CITYLIGHTS_MONGO_HOST || 'localhost'
  const port = process.env.CITYLIGHTS_MONGO_PORT || '27017'
  const db = process.env.CITYLIGHTS_MONGO_DB || 'microman_dev'

  let url = `mongodb://${host}:${port}/${db}`
  const user = process.env.CITYLIGHTS_MONGO_USER
  const pass = process.env.CITYLIGHTS_MONGO_PASS

  const opts = {
    db: { native_parser: true },
    server: { poolSize: 5 }
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
