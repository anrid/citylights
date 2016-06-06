'use strict'

import ObjectId from 'bson-objectid'

import * as types from '../actions/actionTypes'

// const initialState = {
//   order: ['PROJ1', 'PROJ2', 'PROJ3', 'PROJ4', 'PROJ5', 'PROJ6', 'PROJ7'],
//   data: {
//     PROJ1: { _id: 'PROJ1', title: 'Time Off', members: [], color: 0, noMembers: true, type: 'special' },
//     PROJ2: { _id: 'PROJ2', title: 'Ikea', members: [], color: 1, type: 'tasks' },
//     PROJ3: { _id: 'PROJ3', title: 'Konsum', members: [], color: 2, type: 'tasks' },
//     PROJ4: { _id: 'PROJ4', title: 'H&M', members: [], color: 3, type: 'tasks' },
//     PROJ5: { _id: 'PROJ5', title: 'Engagement & Support Team', members: [], color: 4, type: 'tasks' },
//     PROJ6: { _id: 'PROJ6', title: 'New Marketing Website — Phase 1', members: [], color: 5, type: 'tasks' },
//     PROJ7: { _id: 'PROJ7', title: 'New Marketing Website — Phase 2', members: [], color: 5, type: 'tasks' }
//   }
// }

const initialState = {
  order: [],
  data: { }
}

function createProject (state, payload) {
  const n = { ...state }
  const { title, workspaceId, ownerId } = payload
  const created = {
    _id: ObjectId.generate(),
    title,
    workspaceId,
    ownerId,
    members: [],
    color: 1,
    type: 'tasks'
  }
  n.order = [created._id, ...n.order]
  n.data[created._id] = created
  return n
}

function toggleMember (state, payload) {
  const n = { ...state }
  const { projectId, userId } = payload
  const updated = { ...state.data[projectId] }
  if (updated.members.find((x) => x === userId)) {
    updated.members = updated.members.filter((x) => x !== userId)
  } else {
    updated.members = updated.members.concat(userId)
  }
  n.data[projectId] = updated
  return n
}

function removeProject (state, payload) {
  const n = { ...state }
  const { projectId } = payload
  delete n.data[projectId]
  n.order = n.order.filter((x) => x !== projectId)
  return n
}

function updateProject (state, payload) {
  const n = { ...state }
  const { projectId, key, value } = payload
  const updated = { ...state.data[projectId] }
  updated[key] = value
  updated.updated = new Date()
  n.data[updated._id] = updated
  return n
}

function receiveProject (state, payload) {
  const n = { ...state }
  const { project } = payload
  n.order = n.order.concat(project._id)
  n.order = [ ...new Set(n.order) ] // Ensure it’s unique.
  n.data[project._id] = project
  return n
}

function receiveProjectList (state, payload) {
  const n = { ...state }
  const { projectList } = payload

  // Replace all local state.
  n.order = projectList.map((x) => x._id)
  n.order = [ ...new Set(n.order) ]

  n.data = projectList.reduce((acc, x) => {
    acc[x._id] = x
    return acc
  }, { })
  return n
}

export default function projects (state = initialState, action = {}) {
  switch (action.type) {
    case types.TOGGLE_PROJECT_MEMBER:
      return toggleMember(state, action.payload)
    case types.CREATE_PROJECT:
      return createProject(state, action.payload)
    case types.UPDATE_PROJECT:
      return updateProject(state, action.payload)
    case types.REMOVE_PROJECT:
      return removeProject(state, action.payload)
    case types.RECEIVE_PROJECT:
      return receiveProject(state, action.payload)
    case types.RECEIVE_PROJECT_LIST:
      return receiveProjectList(state, action.payload)
    default:
      return state
  }
}
