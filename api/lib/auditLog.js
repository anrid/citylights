import mongoose from 'mongoose'

const Schema = mongoose.Schema

// Simplified audit log service for now
const _stats = {
  logged: 0,
  processed: 0,
  checkpoints: 0,
  lastLog: null,
  lastRun: null,
  lastRunTime: ''
}

function createAuditLogModel () {
  const schema = new Schema({
    userId: { type: String, index: true },
    created: { type: Date, default: Date.now },
    topic: String,
    json: String
  })
  return mongoose.model('audit_log', schema)
}

const AuditLog = createAuditLogModel()

function log (userId, topic, payload) {
  // Simplified logging - ensure this happens completely async.
  process.nextTick(async () => {
    try {
      let json = JSON.stringify(payload)

      // Clean stuff out.
      if (json.indexOf('"accessToken":') !== -1) {
        json = json.replace(/"accessToken":".*?"/, '"accessToken":"XXX"')
      }
      if (json.indexOf('"password":') !== -1) {
        json = json.replace(/"password":".*?"/, '"password":"XXX"')
      }

      // Fire and forget.
      await AuditLog.create({ userId, topic, json })
      _stats.logged++
      _stats.lastLog = Date.now()
    } catch (error) {
      console.error('Audit log error:', error)
    }
  })
}

// Simplified parse function for now
async function parse () {
  console.log('Audit log parse called - simplified implementation')
  _stats.lastRun = _stats.lastLog
  _stats.lastRunTime = '0 ms'
}

export default {
  log,
  parse
}
