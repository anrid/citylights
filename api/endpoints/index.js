'use strict'

const Auth = require('./authEndpoints')
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
  'logout': { func: Auth.logout, auth: false },
  'signup': { func: Auth.signup, auth: false },
  'echo': { func: echo, auth: false },
  'heartbeat': { func: echo, auth: false },
  'app:starter': { func: Auth.appStarter, auth: true },
  'workspace:create': { func: Workspace.create, auth: true }
}

module.exports = socketEndpoints
