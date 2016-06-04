'use strict'

import Moment from 'moment'
import ObjectId from 'bson-objectid'

import * as types from '../actions/actionTypes'

const initialState = {
  order: ['PROJ1', 'PROJ2', 'PROJ3', 'PROJ4', 'PROJ5', 'PROJ6', 'PROJ7'],
  data: {
    PROJ1: { _id: 'PROJ1', title: 'Time Off', members: [], color: 0, noMembers: true, type: 'special' },
    PROJ2: { _id: 'PROJ2', title: 'Ikea', members: [], color: 1, type: 'tasks' },
    PROJ3: { _id: 'PROJ3', title: 'Konsum', members: [], color: 2, type: 'tasks' },
    PROJ4: { _id: 'PROJ4', title: 'H&M', members: [], color: 3, type: 'tasks' },
    PROJ5: { _id: 'PROJ5', title: 'Engagement & Support Team', members: [], color: 4, type: 'tasks' },
    PROJ6: { _id: 'PROJ6', title: 'New Marketing Website — Phase 1', members: [], color: 5, type: 'tasks' },
    PROJ7: { _id: 'PROJ7', title: 'New Marketing Website — Phase 2', members: [], color: 5, type: 'tasks' }
  }
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

export default function projects (state = initialState, action = {}) {
  switch (action.type) {
    case types.TOGGLE_PROJECT_MEMBER:
      return toggleMember(state, action.payload)
    default:
      return state
  }
}
