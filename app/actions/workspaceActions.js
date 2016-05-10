'use strict'

import * as settingsActions from './settingsActions'
import * as types from './actionTypes'
import { request } from '../lib/apiClient'

export function createWorkspace (name) {
  return (dispatch) => {
    dispatch(settingsActions.showServerError(null))
    request('workspace:create', { name })
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
