
import mongoose from 'mongoose'
const Schema = mongoose.Schema

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

export default mongoose.model('workspace_member', schema)
