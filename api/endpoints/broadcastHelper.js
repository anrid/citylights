'use strict'

function workspaceWide (workspace, payload) {
  const _userIds = [].concat(
    workspace.ownerId,
    workspace.admins,
    workspace.members
  )
  const userIds = [ ...new Set(_userIds) ]

  return [{
    userIds,
    payload
  }]
}

module.exports = {
  workspaceWide
}
