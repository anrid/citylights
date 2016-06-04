'use strict'

const P = require('bluebird')
const T = require('tcomb')

const UserService = require('./userService')
const WorkspaceService = require('./workspaceService')
const ProjectService = require('./projectService')
const AccessService = require('./accessService')

const getStarter = P.coroutine(function * (workspaceId, userId) {
  T.String(workspaceId)
  T.String(userId)

  // Ensure all is well in the world.
  const user = yield AccessService.requireUser(userId)

  // Fetch the workspace, or throw if it’s not accessible for some reason.
  let workspace = yield AccessService.requireWorkspace(workspaceId, userId)

  // Fetch a list of available, accessible workspaces.
  let workspaceList = yield WorkspaceService.getList(userId)

  // Fetch all members of the current workspace.
  const userList = yield UserService.getByWorkspaceId(workspace._id.toString())

  // Fetch all available, accessible projects in the current workspace.
  const projectList = yield ProjectService.getList(workspaceId, userId)

  return {
    user,
    userList,
    workspace,
    workspaceList,
    projectList
  }
})

module.exports = {
  getStarter
}
