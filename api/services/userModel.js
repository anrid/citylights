
import mongoose from 'mongoose'
const Schema = mongoose.Schema

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
  profile: { type: Schema.Types.Mixed, default: { photo: null } }
})

export default mongoose.model('user', schema)
