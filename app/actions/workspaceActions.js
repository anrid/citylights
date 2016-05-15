'use strict'

import * as settingsActions from './settingsActions'
import * as types from './actionTypes'
import { send, request } from '../lib/apiClient'

export function createWorkspace (name) {
  return (dispatch) => {
    dispatch(settingsActions.showServerError(null))
    request('workspace:create', { name })
  }
}

export function updateWorkspace (updates) {
  return (dispatch, getState) => {
    const { workspaceId } = getState().settings.saved

    // Update every field separately.
    Object.keys(updates).forEach((key) => {
      const value = updates[key]
      if (typeof value !== 'undefined') {
        send('workspace:update', { workspaceId, update: { [key]: value } })
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
