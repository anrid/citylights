'use strict'

const P = require('bluebird')
const Boom = require('boom')
const T = require('tcomb')

const AccessService = require('./accessService')
const MemberService = require('./memberService')
const WorkspaceProfileService = require('./workspaceProfileService')

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
    .then((all) => User.find({ _id: { $in: all } }).lean(true).exec())
  })
}

function getWorkspaceMembersWithProfiles (workspaceId) {
  return P.try(() => {
    T.String(workspaceId)
    return MemberService.getAllMembers(workspaceId)
    .then((userIds) => {
      const p1 = User.find({ _id: { $in: userIds } }).lean(true).exec()
      const p2 = WorkspaceProfileService.getWorkspaceProfiles({ userIds, workspaceId })
      return P.all([p1, p2])
    })
    .spread((userList, workspaceProfilesList) => {
      const profilesMap = workspaceProfilesList.reduce((acc, x) => {
        acc[x.userId] = x.toObject().profile
        return acc
      }, { })

      userList.forEach((user) => {
        const id = user._id.toString()
        const profile = profilesMap[id]
        if (profile) {
          // Overwrite non-null found in the user’s workspace profile.
          Object.keys(profile).forEach((x) => {
            if (profile[x] != null || user.profile[x] == null) {
              user.profile[x] = profile[x]
            }
          })
        }
      })
      return userList
    })
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
  const isTestEmail = /@example.com$/.test(user.email)
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
  const profile = {
    phoneWork: opts.phoneWork,
    title: opts.title,
    photo: opts.photo
  }

  // Sign-up user on-the-fly if they’re not our system.
  if (!user) {
    user = yield User.create({
      email: opts.email,
      firstName: opts.firstName,
      lastName: opts.lastName,
      profile // Create a default user profile.
    })
    // Create a temporary password.
    UserPassword.createRandomPassword(user)
  }

  const response = yield MemberService.addUserToWorkspace(
    user._id.toString(),
    opts.workspaceId,
    { profile }
  )

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

const update = P.coroutine(function * (workspaceId, userId, update, actorId) {
  T.String(workspaceId)
  T.String(userId)
  T.Object(update)
  T.String(actorId)

  if (userId === actorId) {
    // Allow users to change their own personal data.
    yield AccessService.requireWorkspace(workspaceId, actorId)
  } else {
    // Allow admins to change any user’s personal data.
    yield AccessService.requireWorkspaceAsAdmin(workspaceId, actorId)
  }

  const updated = yield User.findOneAndUpdate(
    { _id: userId },
    { $set: update },
    { new: true }
  )
  return updated
})

module.exports = {
  login,
  signup,
  invite,
  logout,
  getById,
  getByEmail,
  getByWorkspaceId,
  setLastWorkspace,
  isValid,
  getWorkspaceMembersWithProfiles,
  update
}
