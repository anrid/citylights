import T from 'tcomb'
import WorkspaceMember from './workspaceMemberModel.js'

async function getAllMembers(workspaceId) {
  T.String(workspaceId)
  const workspaceMember = await WorkspaceMember.findOne({ workspaceId })
  if (!workspaceMember) {
    return []
  }
  
  // Return all members including owner and admins
  const allMembers = [
    workspaceMember.ownerId,
    ...workspaceMember.admins,
    ...workspaceMember.members
  ]
  
  // Remove duplicates
  return [...new Set(allMembers)]
}

async function getWorkspaces(userId) {
  T.String(userId)
  const workspaceMembers = await WorkspaceMember.find({
    $or: [
      { ownerId: userId },
      { admins: userId },
      { members: userId }
    ]
  })
  
  return workspaceMembers.map(wm => wm.workspaceId)
}

async function addUserToWorkspace(userId, workspaceId, options = {}) {
  T.String(userId)
  T.String(workspaceId)
  
  // Check if WorkspaceMember record already exists
  let workspaceMember = await WorkspaceMember.findOne({ workspaceId })
  
  if (!workspaceMember) {
    // Create new WorkspaceMember record with user as owner
    workspaceMember = await WorkspaceMember.create({
      workspaceId,
      ownerId: userId,
      members: [],
      admins: []
    })
  } else {
    // Add user to existing workspace
    if (options.admin && !workspaceMember.admins.includes(userId)) {
      workspaceMember.admins.push(userId)
    } else if (!options.admin && !workspaceMember.members.includes(userId)) {
      workspaceMember.members.push(userId)
    }
    
    await workspaceMember.save()
  }
  
  return { success: true }
}

export default {
  getAllMembers,
  getWorkspaces,
  addUserToWorkspace
}