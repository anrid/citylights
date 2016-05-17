
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const schema = new Schema({
  workspaceId: {
    type: String,
    required: true,
    unique: true
  },
  ownerId: { type: String, required: true },
  members: [String],
  admins: [String],
  history: { type: Object, default: { } }
})

module.exports = Mongoose.model('workspace_members', schema)
