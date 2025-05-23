'use strict'

const P = require('bluebird')
const Boom = require('@hapi/boom')
const T = require('tcomb')

const User = require('./userModel')
const Workspace = require('./workspaceModel')
const Project = require('./projectModel')
const Shift = require('./shiftModel')
const WorkspaceMember = require('./workspaceMemberModel')

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

const requireWorkspace = P.coroutine(function * (workspaceId, userId, opts = { }) {
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

  // Require normal member.
  let memberLevel = [
    { ownerId: userId },
    { admins: userId },
    { members: userId }
  ]
  if (opts.admin) {
    // Require workspace owner or admin.
    memberLevel = [
      { ownerId: userId },
      { admins: userId }
    ]
  }

  const members = yield WorkspaceMember.findOne({
    workspaceId,
    $or: memberLevel
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

const requireShift = P.coroutine(function * (shiftId, userId) {
  T.String(shiftId)
  T.String(userId)

  const shift = yield Shift.findOne({
    _id: shiftId,
    isEnabled: true,
    isDeleted: false
  })
  if (!shift) {
    throw Boom.unauthorized('Cannot find a valid shift')
  }

  return shift
})

const requireProjectAsAdmin = P.coroutine(function * (projectId, actorId) {
  const project = yield requireProject(projectId, actorId)
  const isOwner = project.ownerId === actorId
  const isAdmin = project.admins.find((x) => x === actorId)
  if (!isOwner && !isAdmin) {
    throw Boom.unauthorized('Is not project owner or admin')
  }
  return project
})

const requireWorkspaceAsAdmin = P.coroutine(function * (workspaceId, actorId) {
  const workspace = yield requireWorkspace(workspaceId, actorId, { admin: true })
  return workspace
})

module.exports = {
  requireUser,
  requireWorkspace,
  requireProject,
  requireProjectAsAdmin,
  requireShift,
  requireWorkspaceAsAdmin
}
