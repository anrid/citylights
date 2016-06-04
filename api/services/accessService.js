'use strict'

const P = require('bluebird')
const Boom = require('boom')
const T = require('tcomb')

const User = require('./userModel')
const Workspace = require('./workspaceModel')
const Project = require('./projectModel')
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

const requireProject = P.coroutine(function * (projectId, userId) {
  T.String(projectId)
  T.String(userId)

  const project = yield Project.findOne({
    _id: projectId,
    $or: [
      { ownerId: userId },
      { admins: userId },
      { members: userId },
      { isPrivate: false }
    ],
    isEnabled: true,
    isDeleted: false
  })
  if (!project) {
    throw Boom.unauthorized('Cannot find a valid project')
  }

  // Ensure user still has workspace access.
  yield requireWorkspace(project.workspaceId, userId)

  return project
})

module.exports = {
  requireUser,
  requireWorkspace,
  requireProject
}
