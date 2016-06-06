'use strict'

import * as types from './actionTypes'

export function assignConsultant (shiftId, userId) {
  return {
    type: types.ASSIGN_CONSULTANT,
    payload: { shiftId, userId }
  }
}

export function createShift (projectId, assignee, startDate, color) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CREATE_SHIFT,
      payload: {
        projectId,
        assignee,
        startDate,
        color,
        ownerId: getState().settings.identity.userId
      }
    })
  }
}

export function updateShift (shiftId, key, value) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_SHIFT,
      payload: { shiftId, key, value }
    })
    // TODO: Send to server !
  }
}
