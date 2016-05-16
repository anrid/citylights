'use strict'

const P = require('bluebird')
const Boom = require('boom')

const Workspace = require('./workspaceModel')

function ensureHasWorkspaceAccess (userId, workspaceId) {
  return P.resolve(Workspace.findOne({
    _id: workspaceId,
    $or: [
      { ownerId: userId },
      { admins: userId },
      { members: userId }
    ]
  }))
  .tap((workspace) => {
    if (!workspace) {
      throw Boom.unauthorized('Cannot access workspace')
    }
  })
}

module.exports = {
  ensureHasWorkspaceAccess
}
