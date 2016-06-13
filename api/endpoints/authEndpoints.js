'use strict'

const P = require('bluebird')
const Joi = require('joi')

const Jwt = require('../lib/jwt')
const UserService = require('../services/userService')
const StarterService = require('../services/starterService')
const WorkspaceService = require('../services/workspaceService')
const AccessService = require('../services/accessService')
const Schemas = require('./schemas')

const checkAccessToken = P.coroutine(function * (payload) {
  try {
    const valid = Schemas.validateOrThrow(payload, checkAccessTokenSchema)

    const decoded = Jwt.verifyToken(valid.accessToken)
    const userId = decoded.userId

    // Get user or throw if the account has been disabled, deleted, or doesn’t exist !
    const user = yield AccessService.requireUser(userId)

    return {
      topic: 'auth:token:successful',
      payload: {
        identity: { userId: user._id.toString() },
        info: { email: user.email }
      }
    }
  } catch (err) {
    console.log('Auth token failed:', err)
    return {
      topic: 'auth:failed',
      payload: { error: 'Blow all the tanks ! Blow everything !' }
    }
  }
})

const login = P.coroutine(function * (payload) {
  const valid = Schemas.validateOrThrow(payload, loginFormSchema)

  const user = yield UserService.login(valid.email, valid.password)
  const userId = user._id.toString()

  let workspaceId = user.lastWorkspaceId
  if (!workspaceId) {
    let workspaceList = yield WorkspaceService.getList(userId)
    // Make sure we’ve got at least one workspace.
    if (!workspaceList.length) {
      // No workspaces found for user, create a new one on-the-fly.
      const workspace = yield WorkspaceService.create('My Workspace', userId)
      workspaceList = [ workspace ]
    }
    workspaceId = workspaceList[0]._id.toString()
  }

  return {
    topic: 'auth:successful',
    payload: {
      identity: {
        userId,
        accessToken: Jwt.createToken({ userId })
      },
      info: {
        email: user.email,
        workspaceId,
        login: new Date()
      }
    }
  }
})

const signup = P.coroutine(function * (payload) {
  const valid = Schemas.validateOrThrow(payload, signupFormSimpleSchema)

  const user = yield UserService.signup(valid)
  const userId = user._id.toString()
  const workspace = yield WorkspaceService.create(valid.companyName, userId)

  return {
    topic: 'auth:successful',
    payload: {
      identity: {
        userId,
        accessToken: Jwt.createToken({ userId })
      },
      info: {
        email: user.email,
        workspaceId: workspace._id.toString(),
        signup: new Date()
      }
    }
  }
})

const logout = P.coroutine(function * (payload) {
  const valid = Schemas.validateOrThrow(payload, logoutSchema)
  yield UserService.logout(valid.accessToken)
  return {
    topic: 'logout:successful',
    payload: { ok: 1 }
  }
})

const appStarter = P.coroutine(function * (payload, context) {
  const valid = Schemas.validateOrThrow(payload, appStarterSchema)
  const starter = yield StarterService.getStarter(valid.workspaceId, context.userId)
  return {
    topic: 'app:starter',
    payload: starter
  }
})

const checkAccessTokenSchema = Joi.object().keys({
  accessToken: Joi.string().min(30).required().description('User access token.')
})

const loginFormSchema = Joi.object().keys({
  email: Joi.string().email().required().description('User email address.'),
  password: Joi.string().min(6).max(64).required().description('User password.')
})

const signupFormSimpleSchema = Joi.object().keys({
  companyName: Joi.string().min(3).required().description('The name of the company this user represents.'),
  email: Joi.string().email().required().description('User email address.'),
  firstName: Joi.string().min(1).required().description('User first name.'),
  lastName: Joi.string().min(1).required().description('User last name.'),
  password: Joi.string().min(6).optional().description('User password.')
})

const logoutSchema = Joi.object().keys({
  accessToken: Joi.string().min(30).required().description('User access token.')
})

const appStarterSchema = Joi.object().keys({
  workspaceId: Joi.string().min(20).required().description('Current workspace id.')
})

module.exports = {
  login,
  logout,
  signup,
  checkAccessToken,
  appStarter
}
