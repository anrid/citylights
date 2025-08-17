import T from 'tcomb'

async function getList(workspaceId, userId) {
  T.String(workspaceId)
  T.String(userId)
  return [] // Stub implementation
}

async function create(projectData, userId) {
  T.Object(projectData)
  T.String(userId)
  return { _id: projectData._id, ...projectData } // Stub implementation
}

async function update(projectId, updateData, userId) {
  T.String(projectId)
  T.Object(updateData)
  T.String(userId)
  return { _id: projectId, ...updateData } // Stub implementation
}

async function addMember(memberId, projectId, userId) {
  return { _id: projectId } // Stub implementation
}

async function removeMember(memberId, projectId, userId) {
  return { _id: projectId } // Stub implementation
}

async function remove(projectId, userId) {
  return { _id: projectId } // Stub implementation
}

export default {
  getList,
  create,
  update,
  addMember,
  removeMember,
  remove
}