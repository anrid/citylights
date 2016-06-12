
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
  admins: [String]
})

module.exports = Mongoose.model('workspace_member', schema)
