import Boom from '@hapi/boom'
import T from 'tcomb'

import User from './userModel.js'
import Workspace from './workspaceModel.js'
import Project from './projectModel.js'
import Shift from './shiftModel.js'
import WorkspaceMember from './workspaceMemberModel.js'

async function requireUser(userId) {
  T.String(userId)
  const user = await User.findOne({ _id: userId })
  
  if (!user) {
    throw Boom.unauthorized('User account does not exist.')
  }
  if (!user.isEnabled) {
    throw Boom.unauthorized('User account is suspended.')
  }
  if (user.isDeleted) {
    throw Boom.unauthorized('User account is deleted.')
  }
  
  return user
}

async function requireWorkspace(workspaceId, userId, opts = {}) {
  T.String(workspaceId)
  T.String(userId)

  const workspace = await Workspace.findOne({
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

  const members = await WorkspaceMember.findOne({
    workspaceId,
    $or: memberLevel
  })
  if (!members) {
    throw Boom.unauthorized('Cannot access workspace')
  }

  return workspace
}

async function requireProject(projectId, userId) {
  T.String(projectId)
  T.String(userId)

  const project = await Project.findOne({
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
  await requireWorkspace(project.workspaceId, userId)

  return project
}

async function requireShift(shiftId, userId) {
  T.String(shiftId)
  T.String(userId)

  const shift = await Shift.findOne({
    _id: shiftId,
    isEnabled: true,
    isDeleted: false
  })
  if (!shift) {
    throw Boom.unauthorized('Cannot find a valid shift')
  }

  return shift
}

async function requireProjectAsAdmin(projectId, actorId) {
  const project = await requireProject(projectId, actorId)
  const isOwner = project.ownerId === actorId
  const isAdmin = project.admins.find((x) => x === actorId)
  if (!isOwner && !isAdmin) {
    throw Boom.unauthorized('Is not project owner or admin')
  }
  return project
}

async function requireWorkspaceAsAdmin(workspaceId, actorId) {
  const workspace = await requireWorkspace(workspaceId, actorId, { admin: true })
  return workspace
}

export default {
  requireUser,
  requireWorkspace,
  requireProject,
  requireProjectAsAdmin,
  requireShift,
  requireWorkspaceAsAdmin
}