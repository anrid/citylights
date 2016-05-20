'use strict'

const P = require('bluebird')
const Boom = require('boom')
const T = require('tcomb')

const User = require('./userModel')
const Workspace = require('./workspaceModel')
const WorkspaceMembers = require('./workspaceMembersModel')

function requireUser (userId) {
  return P.try(() => {
    T.String(userId)
    return P.resolve(User.findOne({ _id: userId }))
    .tap((user) => {
      if (!user) {
        throw Boom.unauthorized('User account does not exist.')
      }
      if (!user.isEnabled) {
        throw Boom.unauthorized('User account is suspended.')
      }
      if (user.isDeleted) {
        throw Boom.unauthorized('User account is deleted.')
      }
    })
  })
}

const requireWorkspace = P.coroutine(function * (workspaceId, userId) {
  T.String(workspaceId)
  T.String(userId)

  const workspace = yield Workspace.findOne({
    _id: workspaceId,
    isEnabled: true,
    isDeleted: false
  })
  if (!workspace) {
    throw Boom.unauthorized('Cannot find a valid workspace')
  }

  const members = yield WorkspaceMembers.findOne({
    workspaceId,
    $or: [
      { ownerId: userId },
      { admins: userId },
      { members: userId }
    ]
  })
  if (!members) {
    throw Boom.unauthorized('Cannot access workspace')
  }

  return workspace
})

module.exports = {
  requireUser,
  requireWorkspace
}
