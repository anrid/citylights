'use strict'

const P = require('bluebird')
const T = require('tcomb')

const Project = require('./projectModel')
const AccessService = require('./accessService')

function getById (projectId) {
  return P.try(() => {
    T.String(projectId)
    return Project.findOne({ _id: projectId })
  })
}

const update = P.coroutine(function * (projectId, update, actorId) {
  T.String(projectId)
  T.Object(update)
  T.String(actorId)

  yield AccessService.requireProject(projectId, actorId)

  const project = yield Project.findOneAndUpdate(
    { _id: projectId },
    { $set: update },
    { new: true }
  )
  return project
})

const addMember = P.coroutine(function * (projectId, memberId, actorId) {
  T.String(projectId)
  T.String(memberId)
  T.String(actorId)

  yield AccessService.requireProject(projectId, actorId)

  const project = yield Project.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { members: memberId } },
    { new: true }
  )
  return project
})

const removeMember = P.coroutine(function * (projectId, memberId, actorId) {
  T.String(projectId)
  T.String(memberId)
  T.String(actorId)

  yield AccessService.requireProject(projectId, actorId)

  const project = yield Project.findOneAndUpdate(
    { _id: projectId },
    { $pull: { members: memberId } },
    { new: true }
  )
  return project
})

function create (opts, actorId) {
  return P.try(() => {
    T.String(opts._id)
    T.String(opts.title)
    T.String(opts.workspaceId)
    T.String(actorId)

    return AccessService.requireWorkspace(opts.workspaceId, actorId)
    .then(() => {
      return Project.create(Object.assign({}, opts, {
        ownerId: actorId,
        admins: [actorId]
      }))
    })
  })
}

function getList (workspaceId, userId) {
  return P.try(() => {
    T.String(workspaceId)
    T.String(userId)
    return Project.find({
      workspaceId,
      $or: [
        { ownerId: userId },
        { admins: userId },
        { members: userId },
        { isPrivate: false }
      ],
      isEnabled: true,
      isDeleted: false
    })
    .sort('-created')
    .exec()
  })
}

module.exports = {
  getById,
  create,
  update,
  getList,
  addMember,
  removeMember
}
