'use strict'

const Https = require('https')
const Zlib = require('zlib')
const P = require('bluebird')
const Boom = require('boom')

module.exports = {

  fetchGzipped (url) {
    return this.fetch(url).then((buf) => {
      return new P((resolve) => {
        // Inflate buffer, which is expected to represent a gzipped payload.
        Zlib.gunzip(buf, (err, result) => {
          if (err) {
            throw Boom.badRequest(err)
          }
          resolve(String(result))
        })
      })
    })
  },

  fetch (url) {
    return new P((resolve) => {
      console.log('Fetching URL:', url)

      const req = Https.get(url, (res) => {
        // Expect a status code of < 300.
        if (res.statusCode >= 300) {
          throw Boom.create(res.statusCode, res.statusMessage)
        }
        // Load in chunks and append to a buffer.
        let buf = new Buffer('', 'binary')
        res.on('data', (d) => {
          buf = Buffer.concat([buf, d])
        })
        res.on('end', () => {
          resolve(buf)
        })
        return true
      })

      req.on('error', (e) => {
        console.error('Error:', e)
        throw Boom.badRequest(String(e))
      })
    })
  }
}
