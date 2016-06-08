
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const schema = new Schema({
  title: { type: String, required: true },
  desc: { type: String },
  type: { type: String },
  color: { type: Number, default: 0 },
  ownerId: { type: String, required: true, index: true },
  projectId: { type: String, required: true, index: true },
  workspaceId: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  // IMPORTANT: All shifts are private by default.
  isPrivate: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tags: [String],
  assignee: { type: String, index: true }
})

module.exports = Mongoose.model('shift', schema)
