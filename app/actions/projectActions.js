'use strict'

import * as types from './actionTypes'
import * as settingsActions from './settingsActions'

export function toggleProjectMember (projectId, userId) {
  return {
    type: types.TOGGLE_PROJECT_MEMBER,
    payload: { projectId, userId }
  }
}

export function createAndEditProject (title) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CREATE_PROJECT,
      payload: {
        title: 'New Untitled Project',
        workspaceId: getState().settings.saved.workspaceId,
        ownerId: getState().settings.identity.userId
      }
    })
    const newProjectId = getState().projects.order[0]
    dispatch(settingsActions.showProjectProperties(newProjectId))
  }
}

export function createProject (title) {
  return (dispatch, getState) => {
    dispatch({
      type: types.CREATE_PROJECT,
      payload: {
        title,
        workspaceId: getState().settings.saved.workspaceId,
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
