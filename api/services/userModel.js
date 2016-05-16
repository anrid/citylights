
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const schema = new Schema({
  name: String,
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
  lastWorkspace: String,
  isOnboarded: { type: Boolean, default: false },

  passwordHash: { type: String, required: true, min: 32 },
  passwordSalt: { type: String, required: true, min: 32 },

  profile: { type: Object, default: { } }
})

schema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.passwordHash
    delete ret.passwordSalt
    return ret
  }
})

module.exports = Mongoose.model('user', schema)
