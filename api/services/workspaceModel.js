
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const schema = new Schema({
  name: { type: String, required: true },
  url: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  ownerId: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  tags: [String],
  members: [String],
  admins: [String]
})

module.exports = Mongoose.model('workspace', schema)
