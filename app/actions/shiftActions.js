'use strict'

import Moment from 'moment'
import ObjectId from 'bson-objectid'

import * as types from './actionTypes'

import { apiRequest } from './backendActions'

export function assignConsultant (shiftId, userId) {
  return {
    type: types.ASSIGN_CONSULTANT,
    payload: { shiftId, userId }
  }
}

export function createShift (projectId, assignee, _startDate, color) {
  return (dispatch, getState) => {
    const start = Moment(_startDate).startOf('day').add(8, 'hours')

    const startDate = start.format()
    const endDate = start.clone().add(8, 'hours').format()

    const ownerId = getState().settings.identity.userId
    const workspaceId = getState().settings.saved.workspaceId

    const data = {
      _id: ObjectId.generate(),
      title: 'N/A',
      projectId,
      workspaceId,
      assignee,
      startDate,
      endDate,
      color,
      ownerId
    }

    dispatch({ type: types.CREATE_SHIFT, payload: data })
    dispatch(apiRequest('shift:create', data))
  }
}

export function updateShift (shiftId, key, value) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_SHIFT,
      payload: { shiftId, key, value }
    })
    dispatch(apiRequest('shift:update', {
      shiftId,
      update: { [key]: value }
    }))
  }
}

export function removeShift (shiftId) {
  return (dispatch) => {
    dispatch({
      type: types.REMOVE_SHIFT,
      payload: { shiftId }
    })
    dispatch(apiRequest('shift:remove', { shiftId }))
  }
}

export function receiveShift (shift) {
  return (dispatch) => {
    dispatch({
      type: types.RECEIVE_SHIFT,
      payload: { shift }
    })
  }
}

export function receiveShiftList (shiftList) {
  return {
    type: types.RECEIVE_SHIFT_LIST,
    payload: { shiftList }
  }
}
