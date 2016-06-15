'use strict'

const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const P = require('bluebird')

const AuditLog = createAuditLogModel()

const SYSTEM_LOGPARSER_INTERVAL = 3000
const SYSTEM_LOGPARSER_CHECKPOINT = 'SYSTEM_LOGPARSER_CHECKPOINT'

const _stats = {
  logged: 0,
  processed: 0,
  checkpoints: 0,
  lastLog: null,
  lastRun: null,
  lastRunTime: ''
}

runParser()

function runParser () {
  setInterval(() => {
    if (_stats.lastLog !== _stats.lastRun) {
      parse()
    }
  }, SYSTEM_LOGPARSER_INTERVAL)
}

function createAuditLogModel () {
  const schema = new Schema({
    userId: { type: String, index: true },
    created: { type: Date, default: Date.now },
    topic: String,
    json: String
  })
  return Mongoose.model('audit_log', schema)
}

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

    // Fire and forget.
    return AuditLog.create({ userId, topic, json })
    .then(() => {
      _stats.logged++
      _stats.lastLog = Date.now()
    })
  })
}

function getLastCheckpoint () {
  return AuditLog
  .find({ userId: SYSTEM_LOGPARSER_CHECKPOINT })
  .sort({ _id: -1 })
  .limit(1)
  .exec()
  .then((checkpoint) => {
    if (checkpoint.length === 1) {
      return checkpoint[0].topic
    }
    return false
  })
}

function getChunkOfLogDocuments (afterId, skip, limit) {
  const where = { userId: { $ne: SYSTEM_LOGPARSER_CHECKPOINT } }
  if (afterId) {
    where._id = { $gt: afterId }
  }
  return AuditLog
  .find(where)
  .skip(skip)
  .limit(limit)
  .exec()
}

function setCheckpoint (lastId) {
  return AuditLog.create({
    userId: SYSTEM_LOGPARSER_CHECKPOINT,
    topic: lastId
  })
  .tap(() => {
    // console.log('Set audit log checkpoint:', lastId)
    _stats.checkpoints++
  })
}

const parse = P.coroutine(function * () {
  const timer = Date.now()
  const lastCheckpointId = yield getLastCheckpoint()
  let skip = 0
  let limit = 1
  let hasMore = true
  let lastId = null

  while (hasMore) {
    const docs = yield getChunkOfLogDocuments(lastCheckpointId, skip, limit)
    if (!docs.length) {
      break
    }
    skip += docs.length
    for (let doc of docs) {
      console.log('Processing log entry:', doc.topic)
      _stats.processed++
      lastId = doc._id.toString()
    }
  }

  if (lastId) {
    yield setCheckpoint(lastId)
  }

  // Mark this run as complete.
  _stats.lastRun = _stats.lastLog
  _stats.lastRunTime = `${Date.now() - timer} ms`

  console.log('Audit log stats:', _stats)
})

module.exports = {
  log,
  parse
}
