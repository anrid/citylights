import T from 'tcomb'

async function getAllMembers(workspaceId) {
  T.String(workspaceId)
  return [] // Stub implementation
}

async function getWorkspaces(userId) {
  T.String(userId)
  return [] // Stub implementation
}

async function addUserToWorkspace(userId, workspaceId, options = {}) {
  T.String(userId)
  T.String(workspaceId)
  return { success: true } // Stub implementation
}

export default {
  getAllMembers,
  getWorkspaces,
  addUserToWorkspace
}