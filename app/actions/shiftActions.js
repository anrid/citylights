'use strict'

import * as types from './actionTypes'

export function assignConsultant (shiftId, userId) {
  return {
    type: types.ASSIGN_CONSULTANT,
    payload: { shiftId, userId }
  }
}

export function createShift (startDate) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CREATE_SHIFT,
      payload: {
        startDate,
        ownerId: getState().settings.identity.userId
      }
    })
  }
}
