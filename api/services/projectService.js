'use strict'

const P = require('bluebird')
const T = require('tcomb')
const Boom = require('@hapi/boom')

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

const addMember = P.coroutine(function * (memberId, projectId, actorId) {
  T.String(memberId)
  T.String(projectId)
  T.String(actorId)

  yield AccessService.requireProject(projectId, actorId)

  const project = yield Project.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { members: memberId } },
    { new: true }
  )
  return project
})

const removeMember = P.coroutine(function * (memberId, projectId, actorId) {
  T.String(memberId)
  T.String(projectId)
  T.String(actorId)

  yield AccessService.requireProject(projectId, actorId)

  const project = yield Project.findOneAndUpdate(
    { _id: projectId },
    { $pull: { members: memberId } },
    { new: true }
  )
  return project
})

const remove = P.coroutine(function * (projectId, actorId) {
  T.String(projectId)
  T.String(actorId)

  const project = yield AccessService.requireProject(projectId, actorId)
  const isOwner = project.ownerId === actorId
  const isAdmin = project.admins.find((x) => x === actorId)
  if (!isOwner && !isAdmin) {
    throw Boom.unauthorized('Cannot delete project')
  }

  const updated = yield Project.findOneAndUpdate(
    { _id: projectId },
    { $set: { isDeleted: true } },
    { new: true }
  )
  return updated
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
  removeMember,
  remove
}
