'use strict'

import * as types from './actionTypes'

export function assignConsultant (shiftId, userId) {
  return {
    type: types.ASSIGN_CONSULTANT,
    payload: { shiftId, userId }
  }
}
