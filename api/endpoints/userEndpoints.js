import Joi from '@hapi/joi'

import UserService from '../services/userService.js'
import WorkspaceProfileService from '../services/workspaceProfileService.js'
import Schemas from './schemas.js'
import Broadcast from './broadcastHelper.js'

const invite = async (payload, context) => {
  const valid = Schemas.validateOrThrow(payload, inviteFormSchema)

  // Invite user and broadcast invite.
  const result = await UserService.invite(valid, context.userId)
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
}

async function update(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, updateUserSchema)
    const user = await UserService.update(valid.workspaceId, valid.userId, valid.update, context.userId)
    const userId = user._id.toString()
    
    return {
      skipSender: true,
      topic: 'user:update',
      payload: {
        userId,
        user
      }
    }
  } catch (error) {
    console.error('Update user failed:', error)
    throw error
  }
}

async function updateWorkProfile(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, updateWorkProfileSchema)
    const profile = await WorkspaceProfileService.updateWorkProfile(valid.workspaceId, valid.userId, valid.update, context.userId)
    
    return {
      skipSender: true,
      topic: 'user:updateWorkProfile',
      payload: { profile }
    }
  } catch (error) {
    console.error('Update work profile failed:', error)
    throw error
  }
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

export {
  invite,
  update,
  updateWorkProfile
}
