'use strict'

const P = require('bluebird')
const T = require('tcomb')

const WorkspaceProfileService = require('./workspaceProfileService')
const Workspace = require('./workspaceModel')
const WorkspaceMember = require('./workspaceMemberModel')
const User = require('./userModel')

function getAllMembers (workspaceId) {
  return P.try(() => {
    T.String(workspaceId)
    return WorkspaceMember.findOne({ workspaceId })
    .then((members) => {
      return [
        members.ownerId,
        ...members.members,
        ...members.admins
      ]
    })
  })
}

const addUserToWorkspace = P.coroutine(function * (userId, workspaceId, opts) {
  T.String(userId)
  T.String(workspaceId)
  T.Object(opts.profile)

  // Add workspaceId to user.
  const user = yield User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { inWorkspaces: workspaceId } },
    { new: true }
  )

  // Add to either members or admins depending on given flag.
  const memberField = opts.admin ? 'admins' : 'members'
  const workspaceMembers = yield WorkspaceMember.findOneAndUpdate(
    { workspaceId },
    {
      // Set user as owner if there’s no entry for this workspace.
      $setOnInsert: { ownerId: userId },
      $addToSet: { [memberField]: userId }
    },
    { new: true, upsert: true }
  )

  // Recalculate members stats and update the workspace.
  const membersCount = new Set([].concat(
    workspaceMembers.ownerId,
    workspaceMembers.admins,
    workspaceMembers.members
  )).size

  const workspace = yield Workspace.findOneAndUpdate(
    { _id: workspaceId },
    { $set: { membersCount } },
    { new: true }
  )

  const profile = yield WorkspaceProfileService.createWorkspaceProfile({
    userId,
    workspaceId,
    profile: opts.profile
  })

  return {
    user,
    workspace,
    profile
  }
})

module.exports = {
  addUserToWorkspace,
  getAllMembers
}
