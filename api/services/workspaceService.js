import T from 'tcomb'

import Workspace from './workspaceModel.js'
import AccessService from './accessService.js'
import MemberService from './memberService.js'

async function getById(workspaceId) {
  T.String(workspaceId)
  return Workspace.findOne({ _id: workspaceId })
}

async function getList(userId) {
  T.String(userId)
  const workspaceIds = await MemberService.getWorkspaces(userId)
  
  // Get the actual workspace objects
  const workspaces = await Promise.all(
    workspaceIds.map(id => Workspace.findOne({ _id: id, isEnabled: true, isDeleted: false }))
  )
  
  // Filter out any null results
  return workspaces.filter(workspace => workspace !== null)
}

async function create(name, ownerId) {
  T.String(name)
  T.String(ownerId)

  // Generate a URL-safe name from the workspace name
  const url = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    + '-' + Date.now() // Add timestamp to ensure uniqueness

  const workspace = await Workspace.create({
    name,
    url,
    ownerId,
    isEnabled: true,
    isDeleted: false
  })

  await MemberService.addUserToWorkspace(ownerId, workspace._id.toString())
  
  return workspace
}

async function update(workspaceId, updateData, actorId) {
  T.String(workspaceId)
  T.Object(updateData)
  T.String(actorId)

  await AccessService.requireWorkspace(workspaceId, actorId)

  const workspace = await Workspace.findOneAndUpdate(
    { _id: workspaceId },
    { $set: updateData },
    { new: true }
  )
  
  return workspace
}

export default {
  getById,
  getList,
  create,
  update
}