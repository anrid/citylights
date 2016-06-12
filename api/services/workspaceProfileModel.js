
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const schema = new Schema({
  workspaceId: { type: String, required: true },
  userId: { type: String, required: true },
  profile: { type: Object, default: { } }
})

schema.index({ workspaceId: 1, userId: 1 }, { unique: true })

module.exports = Mongoose.model('workspace_profile', schema)
