'use strict'

const P = require('bluebird')
const Joi = require('joi')

const Jwt = require('../lib/jwt')
const UserService = require('../services/userService')
const StarterService = require('../services/starterService')
const WorkspaceService = require('../services/workspaceService')
const Schemas = require('./schemas')

function checkAccessToken (payload) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, checkAccessTokenSchema)
    const decoded = Jwt.verifyToken(valid.accessToken)
    const userId = decoded.userId
    return UserService.getById(userId)
    .then((user) => {
      if (!user) {
        return {
          topic: 'auth:failed',
          payload: {
            error: 'user account not found'
          }
        }
      }

      return {
        topic: 'auth:successful',
        payload: {
          userId,
          email: user.email,
          accessToken: valid.accessToken
        }
      }
    })
  })
}

function login (payload) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, loginFormSchema)
    return UserService.login(valid.email, valid.password)
    .then((user) => {
      const userId = user._id.toString()
      return {
        topic: 'auth:successful',
        payload: {
          userId,
          email: user.email,
          accessToken: Jwt.createToken({ userId })
        }
      }
    })
  })
}

function signup (payload) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, signupFormSimpleSchema)
    return UserService.signup(valid)
    .then((user) => {
      const userId = user._id.toString()
      return WorkspaceService.create(valid.companyName, userId)
      .then((workspace) => {
        return {
          topic: 'auth:successful',
          payload: {
            userId,
            workspaceId: workspace._id.toString(),
            email: user.email,
            accessToken: Jwt.createToken({ userId })
          }
        }
      })
    })
  })
}

function logout (payload) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, logoutSchema)
    return UserService.logout(valid.accessToken)
    .then((user) => {
      return {
        topic: 'logout:successful',
        payload: { ok: 1 }
      }
    })
  })
}

function appStarter (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, appStarterSchema)
    return StarterService.getStarter(valid.workspaceId, context.userId)
    .then((payload) => {
      return {
        topic: 'app:starter',
        payload
      }
    })
  })
}

const checkAccessTokenSchema = Joi.object().keys({
  accessToken: Joi.string().min(30).required().description('User access token.')
})

const loginFormSchema = Joi.object().keys({
  email: Joi.string().email().required().description('User email address.'),
  password: Joi.string().min(6).max(64).required().description('User password.')
})

const signupFormSimpleSchema = Joi.object().keys({
  companyName: Joi.string().min(3).required().description('The name of the company this user represents.'),
  email: Joi.string().email().required().description('User email address.')
})

const logoutSchema = Joi.object().keys({
  accessToken: Joi.string().min(30).required().description('User access token.')
})

const appStarterSchema = Joi.object().keys({
  workspaceId: Joi.string().min(20).optional().description('User’s current workspace id.')
})

module.exports = {
  login,
  logout,
  signup,
  checkAccessToken,
  appStarter
}
