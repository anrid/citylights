'use strict'

const P = require('bluebird')
const T = require('tcomb')

const Workspace = require('./workspaceModel')
const WorkspaceMember = require('./workspaceMemberModel')
const WorkspaceProfile = require('./workspaceProfileModel')
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

const createWorkspaceProfile = P.coroutine(function * (opts) {
  T.String(opts.userId)
  T.String(opts.workspaceId)
  T.Object(opts.profile)

  // Create or update workspace profile for user.
  const profile = {
    invited: new Date(),
    removed: null,
    isConsultant: true,
    isPrivate: opts.profile.isPrivate || false,
    title: opts.profile.title,
    phoneWork: opts.profile.phoneWork,
    photo: opts.profile.photo
  }

  return yield WorkspaceProfile.findOneAndUpdate(
    { userId: opts.userId, workspaceId: opts.workspaceId },
    { $set: { profile } },
    { new: true, upsert: true }
  )
})

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

  return {
    user,
    workspace
  }
})

module.exports = {
  addUserToWorkspace,
  getAllMembers,
  createWorkspaceProfile
}
