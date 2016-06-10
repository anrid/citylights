'use strict'

const Fs = require('fs')
const Moment = require('moment')
const Hoek = require('hoek')

Hoek.assert(process.env.CITYLIGHTS_AUDIT_LOG, 'Missing env `CITYLIGHTS_AUDIT_LOG`')

const file = Fs.createWriteStream(process.env.CITYLIGHTS_AUDIT_LOG, { flags: 'a' })
console.log('Audit logging to', process.env.CITYLIGHTS_AUDIT_LOG)

function log (userId, topic, payload) {
  // Ensure this happens completely async.
  process.nextTick(() => {
    let json = JSON.stringify(payload)

    // Clean stuff out.
    if (json.indexOf('"accessToken":') !== -1) {
      json = json.replace(/"accessToken":".*?"/, '"accessToken":"XXX"')
    }
    if (json.indexOf('"password":') !== -1) {
      json = json.replace(/"password":".*?"/, '"password":"XXX"')
    }

    file.write([
      userId,
      topic,
      Date.now(),
      Moment().format(), // Useful when grepping.
      json
    ]
    .join('~|~')
    .replace(/[\t\r\n\s]+/g, ' ')
    .trim() + `\n`)
  })
}

module.exports = {
  log
}
