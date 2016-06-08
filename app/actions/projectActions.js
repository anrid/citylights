'use strict'

import ObjectId from 'bson-objectid'

import * as types from './actionTypes'
import * as settingsActions from './settingsActions'

import { apiRequest } from './backendActions'

export function toggleProjectMember (projectId, userId) {
  return (dispatch, getState) => {
    const project = getState().projects.data[projectId]
    const topic = project.members.find((x) => x === userId)
      ? 'project:removeMember'
      : 'project:addMember'

    dispatch(apiRequest(topic, { projectId, memberId: userId }))

    dispatch({
      type: types.TOGGLE_PROJECT_MEMBER,
      payload: { projectId, userId }
    })
  }
}

export function createAndEditProject (title) {
  return (dispatch, getState) => {
    const data = {
      _id: ObjectId.generate(),
      title: 'New Untitled Project',
      ownerId: getState().settings.identity.userId,
      workspaceId: getState().settings.saved.workspaceId
    }

    dispatch({ type: types.CREATE_PROJECT, payload: data })

    dispatch(settingsActions.showProjectProperties(data._id))

    dispatch(apiRequest('project:create', data))
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
    dispatch(apiRequest('project:update', {
      projectId,
      update: { [key]: value }
    }))
  }
}

export function removeProject (projectId) {
  return (dispatch) => {
    dispatch({
      type: types.REMOVE_PROJECT,
      payload: { projectId }
    })
    dispatch(apiRequest('project:remove', { projectId }))
  }
}

export function receiveProject (project) {
  return (dispatch) => {
    dispatch({
      type: types.RECEIVE_PROJECT,
      payload: { project }
    })
  }
}

export function receiveProjectList (projectList) {
  return {
    type: types.RECEIVE_PROJECT_LIST,
    payload: { projectList }
  }
}
