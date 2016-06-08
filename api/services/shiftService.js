'use strict'

const P = require('bluebird')
const T = require('tcomb')

const Shift = require('./shiftModel')
const AccessService = require('./accessService')

function getById (shiftId) {
  return P.try(() => {
    T.String(shiftId)
    return Shift.findOne({ _id: shiftId })
  })
}

const update = P.coroutine(function * (shiftId, update, actorId) {
  T.String(shiftId)
  T.Object(update)
  T.String(actorId)

  const shift = yield AccessService.requireShift(shiftId, actorId)
  yield AccessService.requireProjectAsAdmin(shift.projectId, actorId)

  const updated = yield Shift.findOneAndUpdate(
    { _id: shiftId },
    { $set: update },
    { new: true }
  )
  return updated
})

const remove = P.coroutine(function * (shiftId, actorId) {
  T.String(shiftId)
  T.String(actorId)

  const shift = yield AccessService.requireShift(shiftId, actorId)
  yield AccessService.requireProjectAsAdmin(shift.projectId, actorId)

  const updated = yield Shift.findOneAndUpdate(
    { _id: shiftId },
    { $set: { isDeleted: true } },
    { new: true }
  )
  return updated
})

function create (opts, actorId) {
  return P.try(() => {
    T.String(opts._id)
    T.String(opts.title)
    T.String(opts.projectId)
    T.String(opts.workspaceId)
    T.String(actorId)

    return AccessService.requireProjectAsAdmin(opts.projectId, actorId)
    .then(() => {
      return Shift.create(Object.assign({}, opts, { ownerId: actorId }))
    })
  })
}

function getList (projectIds, userId) {
  return P.try(() => {
    T.Array(projectIds)
    T.String(userId)
    return Shift.find({
      projectId: { $in: projectIds },
      $or: [
        { ownerId: userId },
        { assignee: userId },
        { isPrivate: false }
      ],
      isEnabled: true,
      isDeleted: false
    })
    .sort('_id')
    .limit(250)
    .exec()
  })
}

module.exports = {
  getById,
  create,
  update,
  getList,
  remove
}
