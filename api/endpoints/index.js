'use strict'

const Auth = require('./authEndpoints')
const User = require('./userEndpoints')
const Workspace = require('./workspaceEndpoints')

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
  'echo': { func: echo, auth: false },
  'heartbeat': { func: echo, auth: false },
  'app:starter': { func: Auth.appStarter, auth: true },
  'workspace:create': { func: Workspace.create, auth: true },
  'workspace:update': { func: Workspace.update, auth: true },
  'user:invite': { func: User.invite, auth: true }
}

module.exports = socketEndpoints
