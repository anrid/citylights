
import * as userActions from './userActions'
import * as settingsActions from './settingsActions'
import { setServerStatus, setAppLoadingStatus, setIdentity } from '../store/settingsSlice'
import * as workspaceActions from './workspaceActions'
import * as projectActions from './projectActions'
import * as shiftActions from './shiftActions'

import { request } from '../lib/apiClient'

export function apiRequest (topic, payload, opts = { }) {
  return (dispatch, getState) => {
    dispatch(settingsActions.setRequestInProgress(true))
    request(topic, payload, opts)
    .finally(() => {
      dispatch(settingsActions.setRequestInProgress(false))
    })
  }
}

export function receiveBackendEvent (event) {
  return (dispatch, getState) => {
    console.log('Received backend event, payload=', event)
    switch (event.topic) {
      case 'connected':
        return dispatch(setServerStatus({ connected: true, waiting: false }))

      case 'disconnected':
        return dispatch(setServerStatus({ connected: false, waiting: false }))

      case 'echo':
        return dispatch(settingsActions.increaseEchoCounter())

      case 'error':
        return dispatch(settingsActions.showServerError(event.payload))

      case 'app:starter':
        return dispatch(onAppStarter(event.payload))

      case 'workspace:create':
        return dispatch(onWorkspaceCreate(event.payload))

      case 'workspace:update':
        return dispatch(workspaceActions.receiveWorkspace(event.payload.workspace))

      case 'project:create':
      case 'project:update':
        return dispatch(projectActions.receiveProject(event.payload.project))

      case 'shift:create':
      case 'shift:update':
        return dispatch(shiftActions.receiveShift(event.payload.shift))

      case 'auth:successful':
        return dispatch(onAuthSuccessful(event.payload))

      case 'auth:token:successful':
        return dispatch(onAuthTokenSuccessful(event.payload))

      case 'auth:failed':
        return dispatch(settingsActions.clearIdentity())

      case 'user:invite:successful':
        dispatch(userActions.receiveUser(event.payload.user))
        dispatch(workspaceActions.receiveWorkspace(event.payload.workspace))
        return

      default:
        if (event.topic && event.topic.indexOf(':response') !== -1) {
          console.log('Server responded:', event.topic.replace(':response', ' [OK]'))
        } else {
          console.log('Unknown event=', event)
        }
    }
  }
}

function onAppStarter (payload) {
  return (dispatch, getState) => {
    dispatch(userActions.receiveUser(payload.user))
    dispatch(userActions.receiveUserList(payload.userList))

    dispatch(workspaceActions.receiveWorkspaceList(payload.workspaceList))
    dispatch(workspaceActions.receiveWorkspace(payload.workspace))

    dispatch(projectActions.receiveProjectList(payload.projectList))

    dispatch(shiftActions.receiveShiftList(payload.shiftList))

    // Declare app `loaded` at this point.
    dispatch(setAppLoadingStatus({ loading: false, loaded: true }))

    // No automatic routing - let React Router handle it based on current URL
    console.log('App starter loaded successfully, app is now ready')
  }
}

function onWorkspaceCreate (payload) {
  return (dispatch, getState) => {
    dispatch(workspaceActions.receiveWorkspace(payload.workspace))
    // Switch to the new workspace.
    dispatch(settingsActions.routeTo({ url: '/switch-workspace' }))
  }
}

function onAuthSuccessful (payload) {
  return (dispatch, getState) => {
    const settings = { ...payload.info }
    dispatch(settingsActions.saveSettings(settings))
    dispatch(setIdentity(payload.identity))
    // Fetch an app starter for the workspaceId returned from the backend.
    dispatch(settingsActions.fetchAppStarter(payload.info.workspaceId))
  }
}

function onAuthTokenSuccessful (payload) {
  return (dispatch, getState) => {
    const { workspaceId } = getState().settings.saved
    if (!workspaceId) {
      // No workspaceId stored at this points ? That won’t do.
      dispatch(settingsActions.clearIdentity())
      return
    }
    // Fetch an app starter for the previously used workspaceId.
    dispatch(settingsActions.fetchAppStarter(workspaceId))
  }
}
