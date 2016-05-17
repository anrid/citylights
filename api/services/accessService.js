'use strict'

const P = require('bluebird')
const Boom = require('boom')

const Workspace = require('./workspaceModel')
const WorkspaceMembers = require('./workspaceMembersModel')

function ensureHasWorkspaceAccess (userId, workspaceId) {
  return P.resolve(Workspace.findOne({
    _id: workspaceId,
    isEnabled: true,
    isDeleted: false
  }))
  .then((workspace) => {
    if (!workspace) {
      throw Boom.unauthorized('Cannot find a valid workspace')
    }
    return P.resolve(WorkspaceMembers.findOne({
      workspaceId,
      $or: [
        { ownerId: userId },
        { admins: userId },
        { members: userId }
      ]
    }))
    .then((workspaceMembers) => {
      if (!workspaceMembers) {
        throw Boom.unauthorized('Cannot access workspace')
      }
      return workspace
    })
  })
}

module.exports = {
  ensureHasWorkspaceAccess
}
