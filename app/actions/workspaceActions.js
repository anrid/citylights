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
    const { workspaceId } = getState().settings
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
  return (dispatch) => {
    // NOTE: Receiving a single workspace makes it the active workspace.
    // The `app:starter` payload must contain the currently active workspace as a single entry.
    dispatch({
      type: types.SET_SETTING,
      payload: { workspaceId: workspace._id }
    })
    dispatch({
      type: types.RECEIVE_WORKSPACE,
      payload: { workspace }
    })
  }
}

export function receiveWorkspaceList (workspaceList) {
  return {
    type: types.RECEIVE_WORKSPACE_LIST,
    payload: { workspaceList }
  }
}
