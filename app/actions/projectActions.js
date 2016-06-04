'use strict'

import * as types from './actionTypes'

export function addOrRemoveMember (projectId, userId) {
  return {
    type: types.TOGGLE_PROJECT_MEMBER,
    payload: { projectId, userId }
  }
}

export function createProject (title) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CREATE_PROJECT,
      payload: {
        title,
        ownerId: getState().settings.identity.userId
      }
    })
  }
}

export function updateProject (projectId, key, value) {
  return (dispatch, getState) => {
    dispatch({
      type: types.UPDATE_PROJECT,
      payload: { projectId, key, value }
    })
    // TODO: Send to server !
  }
}
