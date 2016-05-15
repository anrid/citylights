'use strict'

export function getWorkspaceMemberCount (workspace) {
  if (workspace) {
    if (workspace.membersCount) {
      return workspace.membersCount
    }
    const allMembers = [].concat(
      workspace.ownerId,
      workspace.admins,
      workspace.members
    )
    // Return unique members count.
    return new Set(allMembers).size
  }
  return 0
}
