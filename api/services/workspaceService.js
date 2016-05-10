'use strict'

const P = require('bluebird')
const T = require('tcomb')
const Shortid = require('shortid')
const Boom = require('boom')

const Workspace = require('./workspaceModel')
const UserService = require('./userService')

function getById (workspaceId) {
  return P.try(() => {
    T.String(workspaceId)
    return Workspace.findOne({ _id: workspaceId })
  })
}

function create (name, ownerId) {
  return P.try(() => {
    T.String(name)
    T.String(ownerId)
    const url = Shortid.generate()
    return Workspace.create({
      name,
      ownerId,
      url,
      admins: [ownerId]
    })
    .then((workspace) => {
      return UserService.addUserToWorkspace(
        ownerId, workspace._id.toString()
      )
      .then(() => workspace)
    })
  })
}

function getWorkspaceInfo (workspace) {
  return {
    _id: workspace._id.toString(),
    name: workspace.name,
    url: workspace.url,
    membersCount: workspace.members.length,
    admins: workspace.admins,
    ownerId: workspace.ownerId,
    created: workspace.created
  }
}

function getList (userId) {
  return P.try(() => {
    T.String(userId)
    return Workspace.find({
      $or: [
        { ownerId: userId },
        { admins: userId },
        { members: userId }
      ],
      isEnabled: true,
      isDeleted: false
    })
    .sort('name')
    .exec()
    .then((workspaces) => workspaces.map(getWorkspaceInfo))
  })
}

function hasAccess (userId, workspace) {
  if (workspace.ownerId === userId) {
    return true
  }
  if (workspace.admins.find((x) => x === userId)) {
    return true
  }
  if (workspace.members.find((x) => x === userId)) {
    return true
  }
  throw Boom.unauthorized('Cannot access workspace')
}

module.exports = {
  getById,
  create,
  getList,
  getWorkspaceInfo,
  hasAccess
}
