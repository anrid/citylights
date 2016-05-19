'use strict'

const P = require('bluebird')
const Joi = require('joi')

const UserService = require('../services/userService')
const Schemas = require('./schemas')
const Broadcast = require('./broadcastHelper')

const invite = P.coroutine(function * (payload, context) {
  const valid = Schemas.validateOrThrow(payload, inviteFormSchema)

  // Invite user and broadcast invite.
  const result = yield UserService.invite(valid, context.userId)
  const user = result.user
  const workspace = result.workspace

  console.log(`TODO: send invitation email to ${user.email}`)

  const response = {
    user,
    workspace
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

const inviteFormSchema = Joi.object().keys({
  email: Joi.string().email().required().description('User email address.'),
  workspaceId: Joi.string().min(20).required().description('Invite user to this workspace id.'),

  firstName: Joi.string().min(1).description('User first name.'),
  lastName: Joi.string().min(1).description('User last name.'),
  phoneWork: Joi.string().min(6).description('User work contact number.')
})

module.exports = {
  invite
}
