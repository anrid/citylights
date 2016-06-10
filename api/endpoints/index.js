'use strict'

const Auth = require('./authEndpoints')
const User = require('./userEndpoints')
const Workspace = require('./workspaceEndpoints')
const Project = require('./projectEndpoints')
const Shift = require('./shiftEndpoints')

function echo (payload) {
  return {
    topic: 'echo',
    payload
  }
}

// Delegate to other services here.
const socketEndpoints = {
  'auth': { func: Auth.login, auth: false },
  'auth:token': { func: Auth.checkAccessToken, auth: false },

  'signup': { func: Auth.signup, auth: false },
  'logout': { func: Auth.logout, auth: false },

  'echo': { func: echo, auth: false, audit: false },

  'heartbeat': { func: echo, auth: false, audit: false },

  'app:starter': { func: Auth.appStarter, auth: true },

  'workspace:create': { func: Workspace.create, auth: true },
  'workspace:update': { func: Workspace.update, auth: true },

  'project:create': { func: Project.create, auth: true },
  'project:update': { func: Project.update, auth: true },
  'project:addMember': { func: Project.addMember, auth: true },
  'project:removeMember': { func: Project.removeMember, auth: true },
  'project:remove': { func: Project.remove, auth: true },

  'shift:create': { func: Shift.create, auth: true },
  'shift:update': { func: Shift.update, auth: true },
  'shift:remove': { func: Shift.remove, auth: true },

  'user:invite': { func: User.invite, auth: true }
}

module.exports = socketEndpoints
