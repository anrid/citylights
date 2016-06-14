'use strict'

import * as types from './actionTypes'

import { apiRequest } from './backendActions'

export function receiveUser (user) {
  return {
    type: types.RECEIVE_USER,
    payload: { user }
  }
}

export function receiveUserList (userList) {
  return {
    type: types.RECEIVE_USER_LIST,
    payload: { userList }
  }
}

export function updateUser (userId, key, value) {
  return (dispatch, getState) => {
    const { workspaceId } = getState().settings.saved
    dispatch({
      type: types.UPDATE_USER,
      payload: { userId, key, value }
    })
    dispatch(apiRequest('user:update', {
      workspaceId,
      userId,
      update: { [key]: value }
    }))
  }
}

export function updateWorkProfile (userId, key, value) {
  return (dispatch, getState) => {
    const { workspaceId } = getState().settings.saved
    dispatch({
      type: types.UPDATE_USER_WORK_PROFILE,
      payload: { userId, key, value }
    })
    dispatch(apiRequest('user:updateWorkProfile', {
      workspaceId,
      userId,
      update: { [key]: value }
    }))
  }
}
