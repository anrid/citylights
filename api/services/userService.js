'use strict'

const P = require('bluebird')
const Boom = require('boom')
const T = require('tcomb')

const Workspace = require('./workspaceModel')
const WorkspaceMembers = require('./workspaceMembersModel')
const User = require('./userModel')
const UserPassword = require('./userPasswordModel')
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

function getByWorkspaceId (workspaceId) {
  return P.try(() => {
    T.String(workspaceId)
    return WorkspaceMembers.findOne({ workspaceId })
    .then((members) => {
      const all = [
        members.ownerId,
        ...members.members,
        ...members.admins
      ]
      return User.find({ _id: { $in: all } }).exec()
    })
  })
}

// @returns user
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

  yield AccessService.ensureHasWorkspaceAccess(actorId, opts.workspaceId)

  let user = yield User.findOne({ email: opts.email })
  if (!user) {
    // Create a new user on-the-fly.
    user = yield User.create({
      email: opts.email,
      'profile.firstName': opts.firstName,
      'profile.lastName': opts.lastName,
      'profile.phoneWork': opts.phoneWork
    })
    // Create a temporary password.
    UserPassword.createRandomPassword(user)
  }

  const updatedUser = yield addUserToWorkspace(user._id.toString(), opts.workspaceId)
  return updatedUser
})

function logout (accessToken) {
  return P.try(() => {
    T.String(accessToken)
    return true
  })
}

function addUserToWorkspace (userId, workspaceId, _opts) {
  return P.try(() => {
    T.String(userId)
    T.String(workspaceId)
    const opts = _opts || { }

    return P.resolve(User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { inWorkspaces: workspaceId } },
      { new: true }
    ))
    .then((user) => {
      // Add to either members or admins depending on given flag.
      const memberField = opts.admin ? 'admins' : 'members'
      return P.resolve(WorkspaceMembers.findOneAndUpdate(
        { workspaceId },
        {
          // Set user as owner if there’s currently no doc for this workspace.
          $setOnInsert: { ownerId: userId },
          $addToSet: { [memberField]: userId }
        },
        { new: true, upsert: true }
      ))
      // Recalculate members stats and update the workspace.
      .then((workspaceMembers) => {
        const membersCount = new Set([].concat(
          workspaceMembers.ownerId,
          workspaceMembers.admins,
          workspaceMembers.members
        )).size
        return P.resolve(Workspace.findOneAndUpdate(
          { _id: workspaceId },
          { $set: { membersCount } },
          { new: true }
        ))
      })
      .then((workspace) => {
        return {
          user,
          workspace
        }
      })
    })
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
  getByWorkspaceId,
  addUserToWorkspace,
  setLastWorkspace,
  isValid
}
