
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const schema = new Schema({
  name: { type: String, required: true },
  url: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  ownerId: { type: String, required: true, index: true },
  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  tags: [String],
  membersCount: { type: Number, default: 1 },
  domain: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    sparse: true
  }
})

export default mongoose.model('workspace', schema)
