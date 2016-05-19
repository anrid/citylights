
import * as userActions from './userActions'
import * as settingsActions from './settingsActions'
import * as workspaceActions from './workspaceActions'

import { request } from '../lib/apiClient'

export function publicApiRequest (topic, payload) {
  return apiRequest(topic, payload, { requireAuth: false })
}

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
        return dispatch(settingsActions.setConnectedToServer(true))

      case 'disconnected':
        return dispatch(settingsActions.setConnectedToServer(false))

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

      case 'auth:valid':
      case 'auth:successful':
        return dispatch(onAuthSuccessful(event.payload))

      case 'auth:failed':
        return dispatch(settingsActions.clearIdentity())

      case 'user:invite:successful':
        dispatch(userActions.receiveUser(event.payload.user))
        dispatch(workspaceActions.receiveWorkspace(event.payload.workspace))
        return

      default:
        console.log('Unknown event=', event)
    }
  }
}

function onAppStarter (payload) {
  return (dispatch, getState) => {
    dispatch(userActions.receiveUser(payload.user))
    dispatch(workspaceActions.receiveWorkspaceList(payload.workspaceList))
    dispatch(workspaceActions.receiveWorkspace(payload.workspace))

    // Set `settings.saved.workspaceId` to our new workspace.
    dispatch(settingsActions.saveSettings({ workspaceId: payload.workspace._id }))

    // Declare app `loaded` at this point.
    dispatch(settingsActions.setAppLoaded(true))

    // Finally, route to the Overview page.
    const { routing } = getState()
    let routeToUrl = '/overview'
    if (routing && routing.locationBeforeTransitions) {
      // Preserve current route unless we’re coming from /login or /signup.
      const currentUrl = routing.locationBeforeTransitions.pathname
      if (currentUrl !== '/signup' && currentUrl !== '/login') {
        console.log('Preserving current route:', currentUrl)
        routeToUrl = currentUrl
      }
    }

    dispatch(settingsActions.routeTo({ url: routeToUrl }))
  }
}

function onWorkspaceCreate (payload) {
  return (dispatch, getState) => {
    dispatch(workspaceActions.receiveWorkspace(payload.workspace))
    dispatch(settingsActions.saveSettings({ workspaceId: payload.workspace._id }))
    // Switch to the new workspace.
    dispatch(settingsActions.routeTo({ url: '/switch-workspace' }))
  }
}

function onAuthSuccessful (payload) {
  return (dispatch, getState) => {
    const settings = { email: payload.email }
    // NOTE: `payload.workspaceId` will be set if this auth is part of a
    // successful signup.
    if (payload.workspaceId) {
      settings.workspaceId = payload.workspaceId
    }
    dispatch(settingsActions.saveSettings(settings))
    dispatch(settingsActions.setIdentity(payload.userId, payload.accessToken))
  }
}
