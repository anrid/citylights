'use strict'

import * as settingsActions from './settingsActions'
import { apiRequest } from './backendActions'
import * as types from './actionTypes'

export function createWorkspace (name) {
  return (dispatch) => {
    dispatch(settingsActions.showServerError(null))
    dispatch(apiRequest('workspace:create', { name }))
  }
}

export function updateWorkspace (updates) {
  return (dispatch, getState) => {
    const { workspaceId } = getState().settings.saved

    // Update every field separately.
    Object.keys(updates).forEach((key) => {
      const value = updates[key]
      if (typeof value !== 'undefined') {
        dispatch(apiRequest('workspace:update', { workspaceId, update: { [key]: value } }))
      }
    })
  }
}

export function receiveWorkspace (workspace) {
  return {
    type: types.RECEIVE_WORKSPACE,
    payload: { workspace }
  }
}

export function receiveWorkspaceList (workspaceList) {
  return {
    type: types.RECEIVE_WORKSPACE_LIST,
    payload: { workspaceList }
  }
}
