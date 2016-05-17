'use strict'

const P = require('bluebird')
const T = require('tcomb')
const Shortid = require('shortid')

const Workspace = require('./workspaceModel')
const UserService = require('./userService')
const AccessService = require('./accessService')

function getById (workspaceId) {
  return P.try(() => {
    T.String(workspaceId)
    return Workspace.findOne({ _id: workspaceId })
  })
}

const update = P.coroutine(function * (workspaceId, update, actorId) {
  T.String(workspaceId)
  T.Object(update)
  T.String(actorId)

  yield AccessService.ensureHasWorkspaceAccess(actorId, workspaceId)

  const workspace = yield Workspace.findOneAndUpdate(
    { _id: workspaceId },
    { $set: update },
    { new: true }
  )
  return workspace
})

function create (name, actorId) {
  return P.try(() => {
    T.String(name)
    T.String(actorId)
    const url = Shortid.generate()
    return Workspace.create({
      name,
      ownerId: actorId,
      url
    })
    .then((workspace) => {
      return UserService.addUserToWorkspace(
        actorId, workspace._id.toString(), { admin: true }
      )
      .then(() => workspace)
    })
  })
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
  })
}

module.exports = {
  getById,
  create,
  update,
  getList
}
