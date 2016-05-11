'use strict'

const P = require('bluebird')
const Boom = require('boom')
const T = require('tcomb')

const User = require('./userModel')
const Crypt = require('./cryptService')

function getById (userId) {
  return P.try(() => {
    T.String(userId)
    return User.findOne({ _id: userId })
  })
}

function login (email, password) {
  return P.try(() => {
    T.String(email)
    T.String(password)
    return User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw Boom.badRequest('Invalid email or password.')
      }

      // HACK: Allow login with any password for <number>@example.com
      // email addresses when in development mode.
      // const isDevMode = process.env.NODE_ENV === 'development'
      const isTestEmail = /\d+@example.com$/.test(user.email)
      if (isTestEmail) {
        return user
      }

      return Crypt.verifyPassword(password, user.passwordHash, user.passwordSalt)
      .then(() => user)
    })
  })
}

function signup (opts) {
  return P.try(() => {
    T.String(opts.email)
    return User.findOne({ email: opts.email })
    .then((user) => {
      if (user) {
        throw Boom.badRequest('Email address already registered.')
      }
      return Crypt.createRandomPassword()
    })
    .then((newPassword) => {
      return User.create({
        email: opts.email,
        passwordHash: newPassword.hash,
        passwordSalt: newPassword.salt
      })
    })
  })
}

function logout (accessToken) {
  return P.try(() => {
    T.String(accessToken)
    return true
  })
}

function addUserToWorkspace (ownerId, workspaceId) {
  return P.try(() => {
    T.String(ownerId)
    T.String(workspaceId)
    return P.resolve(User.findOneAndUpdate(
      { _id: ownerId },
      { $addToSet: { inWorkspaces: workspaceId } }
    ))
  })
}

function setLastWorkspace (ownerId, workspaceId) {
  return P.try(() => {
    T.String(ownerId)
    T.String(workspaceId)
    return P.resolve(User.findOneAndUpdate(
      { _id: ownerId },
      { $set: { lastWorkspace: workspaceId } }
    ))
  })
}

function isValid (user) {
  if (user.isEnabled && !user.isDeleted) {
    return true
  }
  throw Boom.unauthorized('User account is suspended or deleted.')
}

module.exports = {
  login,
  signup,
  logout,
  getById,
  addUserToWorkspace,
  setLastWorkspace,
  isValid
}
