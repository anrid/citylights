'use strict'

const P = require('bluebird')
const Joi = require('joi')

const UserService = require('../services/userService')
const WorkspaceProfileService = require('../services/workspaceProfileService')
const Schemas = require('./schemas')
const Broadcast = require('./broadcastHelper')

const invite = P.coroutine(function * (payload, context) {
  const valid = Schemas.validateOrThrow(payload, inviteFormSchema)

  // Invite user and broadcast invite.
  const result = yield UserService.invite(valid, context.userId)
  const user = result.user
  const workspace = result.workspace
  const profile = result.profile

  console.log(`TODO: send invitation email to ${user.email}`)
  // console.log('result=', result)

  const response = {
    user,
    workspace,
    profile
  }

  // Broadcast to workspace.
  const broadcast = Broadcast.workspaceWide(
    workspace, response, context.userId
  )

  return {
    topic: 'user:invite:successful',
    // Reply to sender.
    payload: response,
    // Broadcast to interested parties.
    broadcast
  }
})

function update (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, updateUserSchema)
    return UserService.update(valid.workspaceId, valid.userId, valid.update, context.userId)
    .then((user) => {
      const userId = user._id.toString()
      return {
        skipSender: true,
        topic: 'user:update',
        payload: {
          userId,
          user
        }
      }
    })
  })
}

function updateWorkProfile (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, updateWorkProfileSchema)
    return WorkspaceProfileService.updateWorkProfile(valid.workspaceId, valid.userId, valid.update, context.userId)
    .then((profile) => {
      return {
        skipSender: true,
        topic: 'user:updateWorkProfile',
        payload: { profile }
      }
    })
  })
}

const updateWorkProfileSchema = Joi.object().keys({
  workspaceId: Joi.string().min(20).required().description('Profile workspace id.'),
  userId: Joi.string().min(20).required().description('Profile user id.'),
  update: Joi.object().keys({
    phoneWork: Joi.string().min(6).description('User work contact number.'),
    title: Joi.string().min(1).description('User title, in this workspace.'),
    photo: Joi.string().uri({ scheme: [ /https?/ ] }).description('User photo url, starting with http(s)://')
  }).xor(
    'phoneWork', 'title', 'photo'
  )
})

const updateUserSchema = Joi.object().keys({
  workspaceId: Joi.string().min(20).required().description('User’s current workspace id.'),
  userId: Joi.string().min(20).required().description('User id.'),
  update: Joi.object().keys({
    email: Joi.string().email().description('User email address.'),
    firstName: Joi.string().min(1).description('User first name.'),
    lastName: Joi.string().min(1).description('User last name.')
  }).xor(
    'email', 'firstName', 'lastName'
  )
})

const inviteFormSchema = Joi.object().keys({
  email: Joi.string().email().required().description('User email address.'),
  workspaceId: Joi.string().min(20).required().description('Invite user to this workspace id.'),
  firstName: Joi.string().min(1).description('User first name.'),
  lastName: Joi.string().min(1).description('User last name.'),
  phoneWork: Joi.string().min(6).description('User work contact number.'),
  title: Joi.string().min(1).description('User title, in this workspace.'),
  photo: Joi.string().uri({ scheme: [ /https?/ ] }).description('User photo url, starting with http(s)://')
})

module.exports = {
  invite,
  update,
  updateWorkProfile
}
