import mongoose from 'mongoose'
import WorkspaceMember from './api/services/workspaceMemberModel.js'
import Workspace from './api/services/workspaceModel.js'

// Connect to MongoDB
await mongoose.connect('mongodb://admin:password@localhost:27017/citylights_dev?authSource=admin')
console.log('Connected to MongoDB')

// Find all workspaces that don't have WorkspaceMember records
const workspaces = await Workspace.find({ isEnabled: true, isDeleted: false })
console.log(`Found ${workspaces.length} enabled workspaces`)

for (const workspace of workspaces) {
  const existingMember = await WorkspaceMember.findOne({ workspaceId: workspace._id.toString() })
  
  if (!existingMember) {
    console.log(`Creating WorkspaceMember record for workspace: ${workspace.name} (${workspace._id})`)
    await WorkspaceMember.create({
      workspaceId: workspace._id.toString(),
      ownerId: workspace.ownerId,
      members: [],
      admins: []
    })
    console.log(`✓ Created WorkspaceMember record for workspace ${workspace._id}`)
  } else {
    console.log(`✓ WorkspaceMember record already exists for workspace ${workspace._id}`)
  }
}

console.log('Done! All workspaces now have WorkspaceMember records.')
await mongoose.disconnect()