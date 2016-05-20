'use strict'

const P = require('bluebird')
const T = require('tcomb')

const Workspace = require('./workspaceModel')
const WorkspaceMembers = require('./workspaceMembersModel')
const User = require('./userModel')

function getAllMembers (workspaceId) {
  return P.try(() => {
    T.String(workspaceId)
    return WorkspaceMembers.findOne({ workspaceId })
    .then((members) => {
      return [
        members.ownerId,
        ...members.members,
        ...members.admins
      ]
    })
  })
}

const addUserToWorkspace = P.coroutine(function * (userId, workspaceId, _opts) {
  T.String(userId)
  T.String(workspaceId)
  const opts = _opts || { }

  // Add workspaceId to user.
  const user = yield User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { inWorkspaces: workspaceId } },
    { new: true }
  )

  // Add to either members or admins depending on given flag.
  const memberField = opts.admin ? 'admins' : 'members'
  const workspaceMembers = yield WorkspaceMembers.findOneAndUpdate(
    { workspaceId },
    {
      // Set user as owner if there’s no entry for this workspace.
      $setOnInsert: { ownerId: userId },
      $addToSet: { [memberField]: userId }
    },
    { new: true, upsert: true }
  )

  // Create a workspace profile for this user.
  const profilePath = `profiles.${userId}`
  yield WorkspaceMembers.findOneAndUpdate(
    { workspaceId, [profilePath]: { $exists: false } },
    {
      $set: {
        [profilePath]: {
          invited: new Date(),
          isConsultant: true
        }
      }
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

  return {
    user,
    workspace
  }
})

module.exports = {
  addUserToWorkspace,
  getAllMembers
}
