
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const schema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  isEnabled: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  tags: [String],
  inWorkspaces: [String],
  lastWorkspaceId: String,
  isOnboarded: { type: Boolean, default: false },
  profile: { type: Object, default: { } }
})

module.exports = Mongoose.model('user', schema)
