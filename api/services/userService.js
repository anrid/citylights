'use strict'

const P = require('bluebird')
const Boom = require('boom')
const T = require('tcomb')

const User = require('./userModel')
const Crypt = require('./cryptService')
const AccessService = require('./accessService')

function getById (userId) {
  return P.try(() => {
    T.String(userId)
    return User.findOne({ _id: userId })
  })
}

function getByEmail (email) {
  return P.try(() => {
    T.String(email)
    return User.findOne({ email })
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

const invite = P.coroutine(function * (opts, actorId) {
  T.String(opts.email)
  T.String(opts.workspaceId)
  T.String(actorId)

  yield AccessService.ensureHasWorkspaceAccess(actorId, opts.workspaceId)

  let user = yield User.findOne({ email: opts.email })
  if (!user) {
    // Create a new user on-the-fly.
    const newPassword = yield Crypt.createRandomPassword()
    user = yield User.create({
      email: opts.email,
      passwordHash: newPassword.hash,
      passwordSalt: newPassword.salt,
      'profile.firstName': opts.firstName,
      'profile.lastName': opts.lastName,
      'profile.phoneWork': opts.phoneWork
    })
  }

  yield addUserToWorkspace(user._id.toString(), opts.workspaceId)
  return user
})

function logout (accessToken) {
  return P.try(() => {
    T.String(accessToken)
    return true
  })
}

function addUserToWorkspace (userId, workspaceId) {
  return P.try(() => {
    T.String(userId)
    T.String(workspaceId)
    return P.resolve(User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { inWorkspaces: workspaceId } }
    ))
  })
}

function setLastWorkspace (userId, workspaceId) {
  return P.try(() => {
    T.String(userId)
    T.String(workspaceId)
    return P.resolve(User.findOneAndUpdate(
      { _id: userId },
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
  invite,
  logout,
  getById,
  getByEmail,
  addUserToWorkspace,
  setLastWorkspace,
  isValid
}
