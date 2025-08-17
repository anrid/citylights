'use strict'

import * as settingsActions from './settingsActions'
import { apiRequest } from './backendActions'
import * as types from './actionTypes'
import { receiveWorkspace as receiveWorkspaceSlice, receiveWorkspaceList as receiveWorkspaceListSlice } from '../store/workspacesSlice'

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
    console.log('receiveWorkspace called with:', workspace)
    if (workspace && workspace._id) {
      console.log('Dispatching SET_SETTING and RECEIVE_WORKSPACE for:', workspace._id)
      // Update the saved settings to persist the workspace ID
      console.log('Calling saveSettings with workspaceId:', workspace._id)
      dispatch(settingsActions.saveSettings({ workspaceId: workspace._id }))
      console.log('About to dispatch receiveWorkspaceSlice action')
      dispatch(receiveWorkspaceSlice({ workspace }))
      console.log('receiveWorkspaceSlice action dispatched')
    } else {
      console.warn('receiveWorkspace called with null/invalid workspace:', workspace)
    }
  }
}

export function receiveWorkspaceList (workspaceList) {
  console.log('receiveWorkspaceList called with:', workspaceList)
  console.log('Returning receiveWorkspaceListSlice action')
  return receiveWorkspaceListSlice({ workspaceList })
}
