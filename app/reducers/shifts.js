'use strict'

import * as types from '../actions/actionTypes'

// const initialState = {
//   order: ['SF1', 'SF2', 'SF3', 'SF4'],
//   data: {
//     SF1: {
//       _id: 'SF1',
//       assignee: null,
//       startDate: '2016-06-02 10:00:00',
//       endDate: '2016-06-02 18:00:00',
//       color: 3,
//       title: 'H&M',
//       projectId: 'PROJ4'
//     }
//   }
// }

const initialState = {
  order: [],
  data: { }
}

function createShift (state, payload) {
  const n = { ...state }
  const created = { ...payload }
  n.order = n.order.concat(created._id)
  n.data[created._id] = created
  return n
}

function updateShift (state, payload) {
  const n = { ...state }
  const { shiftId, key, value } = payload
  const updated = { ...state.data[shiftId] }
  updated[key] = value
  updated.updated = new Date()
  n.data[updated._id] = updated
  return n
}

function receiveShift (state, payload) {
  const n = { ...state }
  const { shift } = payload
  n.order = n.order.concat(shift._id)
  n.order = [ ...new Set(n.order) ] // Ensure it’s unique.
  n.data[shift._id] = shift
  return n
}

function assignConsultant (state, payload) {
  const n = { ...state }
  const { shiftId, userId } = payload
  const updated = { ...state.data[shiftId] }
  if (updated.assignee) {
    updated.assignee = null
  } else {
    updated.assignee = userId
  }
  n.data[shiftId] = updated
  return n
}

function receiveShiftList (state, payload) {
  const n = { ...state }
  const { shiftList } = payload

  // Replace all local state.
  n.order = shiftList.map((x) => x._id)
  n.order = [ ...new Set(n.order) ]
  n.order.sort()

  n.data = shiftList.reduce((acc, x) => {
    acc[x._id] = x
    return acc
  }, { })
  return n
}

export default function shifts (state = initialState, action = {}) {
  switch (action.type) {
    case types.CREATE_SHIFT:
      return createShift(state, action.payload)
    case types.UPDATE_SHIFT:
      return updateShift(state, action.payload)
    case types.RECEIVE_SHIFT:
      return receiveShift(state, action.payload)
    case types.ASSIGN_CONSULTANT:
      return assignConsultant(state, action.payload)
    case types.RECEIVE_SHIFT_LIST:
      return receiveShiftList(state, action.payload)
    default:
      return state
  }
}
