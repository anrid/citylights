import T from 'tcomb'

import AccessService from './accessService.js'
import WorkspaceProfile from './workspaceProfileModel.js'

async function getWorkspaceProfiles(opts) {
  T.Array(opts.userIds)
  T.String(opts.workspaceId)

  return await WorkspaceProfile.find({
    userId: { $in: opts.userIds },
    workspaceId: opts.workspaceId
  }).exec()
}

async function updateWorkProfile(workspaceId, userId, updateData, actorId) {
  T.String(workspaceId)
  T.String(userId)
  T.Object(updateData)
  T.String(actorId)

  await AccessService.requireWorkspace(workspaceId, actorId)

  const profile = await WorkspaceProfile.findOneAndUpdate(
    { userId, workspaceId },
    { $set: { profile: updateData } },
    { new: true, upsert: true }
  )
  
  return profile
}

export default {
  getWorkspaceProfiles,
  updateWorkProfile
}