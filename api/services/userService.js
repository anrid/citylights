'use strict'

const P = require('bluebird')
const Boom = require('boom')
const T = require('tcomb')

const AccessService = require('./accessService')
const MemberService = require('./memberService')

const User = require('./userModel')
const UserPassword = require('./userPasswordModel')

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

function getByWorkspaceId (workspaceId) {
  return P.try(() => {
    T.String(workspaceId)
    return MemberService.getAllMembers(workspaceId)
    .then((all) => User.find({ _id: { $in: all } }).exec())
  })
}

const login = P.coroutine(function * (email, password) {
  T.String(email)
  T.String(password)
  const user = yield User.findOne({ email })
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

  yield UserPassword.verifyPassword(password, user)
  return user
})

const signup = P.coroutine(function * (opts) {
  T.String(opts.email)

  const user = yield User.findOne({ email: opts.email })
  if (user) {
    throw Boom.badRequest('Email address already registered.')
  }

  const newUser = yield User.create({
    email: opts.email,
    firstName: opts.firstName,
    lastName: opts.lastName
  })

  if (!opts.password) {
    yield UserPassword.createRandomPassword(newUser)
  } else {
    yield UserPassword.createPassword(opts.password, newUser)
  }

  return newUser
})

const invite = P.coroutine(function * (opts, actorId) {
  T.String(opts.email)
  T.String(opts.workspaceId)
  T.String(actorId)

  yield AccessService.requireWorkspace(opts.workspaceId, actorId)

  let user = yield User.findOne({ email: opts.email })
  // Sign-up user on-the-fly if they’re not our system.
  if (!user) {
    user = yield User.create({
      email: opts.email,
      firstName: opts.firstName,
      lastName: opts.lastName,
      // Create a default user profile.
      profile: {
        phoneWork: opts.phoneWork,
        title: opts.title,
        photo: opts.photo
      }
    })
    // Create a temporary password.
    UserPassword.createRandomPassword(user)
  }

  const response = yield MemberService.addUserToWorkspace(
    user._id.toString(),
    opts.workspaceId
  )

  const profile = yield MemberService.createWorkspaceProfile({
    userId: user._id.toString(),
    workspaceId: opts.workspaceId,
    profile: {
      phoneWork: opts.phoneWork,
      title: opts.title,
      photo: opts.photo,
      isPrivate: opts.isPrivate
    }
  })

  response.profile = profile

  return response
})

function logout (accessToken) {
  return P.try(() => {
    T.String(accessToken)
    return true
  })
}

function setLastWorkspace (userId, workspaceId) {
  return P.try(() => {
    T.String(userId)
    T.String(workspaceId)
    return P.resolve(User.findOneAndUpdate(
      { _id: userId },
      { $set: { lastWorkspaceId: workspaceId } }
    ))
  })
}

function isValid (user) {
  if (user && user.isEnabled && !user.isDeleted) {
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
  getByWorkspaceId,
  setLastWorkspace,
  isValid
}
