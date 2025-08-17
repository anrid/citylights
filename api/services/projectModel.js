
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const schema = new Schema({
  title: { type: String, required: true },
  desc: { type: String },
  type: { type: String },
  color: { type: Number, default: 0 },
  ownerId: { type: String, required: true, index: true },
  workspaceId: { type: String, required: true, index: true },
  isEnabled: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  // IMPORTANT: All projects are private by default.
  isPrivate: { type: Boolean, default: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  startDate: { type: Date },
  dueDate: { type: Date },
  completedDate: { type: Date },
  tags: [String],
  members: { type: Array, default: [], index: true },
  admins: { type: Array, default: [], index: true }
})

export default mongoose.model('project', schema)
