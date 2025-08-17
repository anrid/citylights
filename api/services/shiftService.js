import T from 'tcomb'

async function getList(projectIds, userId) {
  T.Array(projectIds)
  T.String(userId)
  return [] // Stub implementation
}

async function create(shiftData, userId) {
  T.Object(shiftData)
  T.String(userId)
  return { _id: shiftData._id, ...shiftData } // Stub implementation
}

async function update(shiftId, updateData, userId) {
  T.String(shiftId)
  T.Object(updateData)
  T.String(userId)
  return { _id: shiftId, ...updateData } // Stub implementation
}

async function remove(shiftId, userId) {
  T.String(shiftId)
  T.String(userId)
  return { _id: shiftId } // Stub implementation
}

export default {
  getList,
  create,
  update,
  remove
}