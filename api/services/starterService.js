'use strict'

const P = require('bluebird')
const T = require('tcomb')

const UserService = require('./userService')
const WorkspaceService = require('./workspaceService')
const AccessService = require('./accessService')

const getStarter = P.coroutine(function * (workspaceId, userId) {
  T.String(userId)
  const user = yield UserService.getById(userId)
  UserService.isValid(user)

  let workspaceList = yield WorkspaceService.getList(userId)
  let workspace = null
  let currentWorkspaceId = workspaceId

  // Make sure we’ve got at least one workspace.
  if (!workspaceList.length) {
    // No workspaces found for user, create a new one on-the-fly.
    workspace = yield WorkspaceService.create('My Workspace', userId)
    workspaceList = [ WorkspaceService.getWorkspaceInfo(workspace) ]
    currentWorkspaceId = workspace._id.toString()
  }

  if (!currentWorkspaceId) {
    // Pick the first workspace from our list if we weren’t supplied
    // with an id.
    currentWorkspaceId = workspaceList[0]._id
  }

  // Fetch the active workspace.
  if (!workspace) {
    // Make sure we can access the workspace.
    workspace = yield AccessService.ensureHasWorkspaceAccess(userId, currentWorkspaceId)
  }

  return {
    user,
    workspace,
    workspaceList
  }
})

module.exports = {
  getStarter
}
