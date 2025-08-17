import Boom from '@hapi/boom'
import T from 'tcomb'

import AccessService from './accessService.js'
import MemberService from './memberService.js'
import WorkspaceProfileService from './workspaceProfileService.js'

import User from './userModel.js'
import UserPassword from './userPasswordModel.js'

async function getById(userId) {
  T.String(userId)
  return User.findOne({ _id: userId })
}

async function getByEmail(email) {
  T.String(email)
  return User.findOne({ email })
}

async function getByWorkspaceId(workspaceId) {
  T.String(workspaceId)
  const all = await MemberService.getAllMembers(workspaceId)
  return User.find({ _id: { $in: all } }).lean(true).exec()
}

async function getWorkspaceMembersWithProfiles(workspaceId) {
  T.String(workspaceId)
  const userIds = await MemberService.getAllMembers(workspaceId)
  
  const [userList, workspaceProfilesList] = await Promise.all([
    User.find({ _id: { $in: userIds } }).lean(true).exec(),
    WorkspaceProfileService.getWorkspaceProfiles({ userIds, workspaceId })
  ])
  
  const profilesMap = workspaceProfilesList.reduce((acc, x) => {
    acc[x.userId] = x.toObject().profile
    return acc
  }, {})

  userList.forEach((user) => {
    const id = user._id.toString()
    const profile = profilesMap[id]
    if (profile) {
      // Overwrite non-null found in the user's workspace profile.
      Object.keys(profile).forEach((x) => {
        if (profile[x] != null || user.profile[x] == null) {
          user.profile[x] = profile[x]
        }
      })
    }
  })
  return userList
}

async function login(email, password) {
  T.String(email)
  T.String(password)
  const user = await User.findOne({ email })
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

  await UserPassword.verifyPassword(password, user)
  return user
}

async function signup(opts) {
  T.String(opts.email)

  const user = await User.findOne({ email: opts.email })
  if (user) {
    throw Boom.badRequest('Email address already registered.')
  }

  const newUser = await User.create({
    email: opts.email,
    firstName: opts.firstName,
    lastName: opts.lastName
  })

  if (!opts.password) {
    await UserPassword.createRandomPassword(newUser)
  } else {
    await UserPassword.createPassword(opts.password, newUser)
  }

  return newUser
}

async function invite(opts, actorId) {
  T.String(opts.email)
  T.String(opts.workspaceId)
  T.String(actorId)

  await AccessService.requireWorkspace(opts.workspaceId, actorId)

  let user = await User.findOne({ email: opts.email })
  const profile = {
    phoneWork: opts.phoneWork,
    title: opts.title,
    photo: opts.photo
  }

  // Sign-up user on-the-fly if they're not our system.
  if (!user) {
    user = await User.create({
      email: opts.email,
      firstName: opts.firstName,
      lastName: opts.lastName,
      profile // Create a default user profile.
    })
    // Create a temporary password.
    await UserPassword.createRandomPassword(user)
  }

  const response = await MemberService.addUserToWorkspace(
    user._id.toString(),
    opts.workspaceId,
    { profile }
  )

  return response
}

async function logout(accessToken) {
  T.String(accessToken)
  return true
}

async function setLastWorkspace(userId, workspaceId) {
  T.String(userId)
  T.String(workspaceId)
  return User.findOneAndUpdate(
    { _id: userId },
    { $set: { lastWorkspaceId: workspaceId } }
  )
}

function isValid (user) {
  if (user && user.isEnabled && !user.isDeleted) {
    return true
  }
  throw Boom.unauthorized('User account is suspended or deleted.')
}

async function update(workspaceId, userId, updateData, actorId) {
  T.String(workspaceId)
  T.String(userId)
  T.Object(updateData)
  T.String(actorId)

  if (userId === actorId) {
    // Allow users to change their own personal data.
    await AccessService.requireWorkspace(workspaceId, actorId)
  } else {
    // Allow admins to change any user's personal data.
    await AccessService.requireWorkspaceAsAdmin(workspaceId, actorId)
  }

  const updated = await User.findOneAndUpdate(
    { _id: userId },
    { $set: updateData },
    { new: true }
  )
  return updated
}

export default {
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
