'use strict'

const P = require('bluebird')
const T = require('tcomb')

const AccessService = require('./accessService')
const WorkspaceProfile = require('./workspaceProfileModel')

const getWorkspaceProfiles = P.coroutine(function * (opts) {
  T.Array(opts.userIds)
  T.String(opts.workspaceId)

  return yield WorkspaceProfile.find({
    userId: { $in: opts.userIds },
    workspaceId: opts.workspaceId
  }).exec()
})

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

const updateWorkProfile = P.coroutine(function * (workspaceId, userId, update, actorId) {
  T.String(workspaceId)
  T.String(userId)
  T.Object(update)
  T.String(actorId)

  if (userId === actorId) {
    // Allow users to change their own personal data.
    yield AccessService.requireWorkspace(workspaceId, actorId)
  } else {
    // Allow admins to change any user’s personal data.
    yield AccessService.requireWorkspaceAsAdmin(workspaceId, actorId)
  }

  const updatedFields = Object.keys(update).reduce((acc, x) => {
    acc[`profile.${x}`] = update[x]
    return acc
  }, { })

  const updated = yield WorkspaceProfile.findOneAndUpdate(
    { workspaceId, userId },
    { $set: updatedFields },
    { new: true }
  )
  return updated
})

module.exports = {
  createWorkspaceProfile,
  getWorkspaceProfiles,
  updateWorkProfile
}
