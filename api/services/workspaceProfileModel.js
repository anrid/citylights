
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const schema = new Schema({
  workspaceId: { type: String, required: true },
  userId: { type: String, required: true },
  profile: { type: Object, default: { } }
})

schema.index({ workspaceId: 1, userId: 1 }, { unique: true })

export default mongoose.model('workspace_profile', schema)
