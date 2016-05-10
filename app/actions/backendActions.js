
import * as userActions from './userActions'
import * as settingsActions from './settingsActions'
import * as workspaceActions from './workspaceActions'

export function receiveBackendEvent (store, event) {
  console.log('Received backend event, payload=', event)
  switch (event.topic) {
    case 'connected':
      return store.dispatch(settingsActions.setConnectedToServer(true))

    case 'disconnected':
      return store.dispatch(settingsActions.setConnectedToServer(false))

    case 'echo':
      return store.dispatch(settingsActions.increaseEchoCounter())

    case 'error':
      return store.dispatch(settingsActions.showServerError(event.payload))

    case 'app:starter':
      return store.dispatch(onAppStarter(event.payload))

    case 'workspace:create':
      return store.dispatch(onWorkspaceCreate(event.payload))

    case 'auth:successful':
      return store.dispatch(onAuthSuccessful(event.payload))

    default:
      console.log('Unknown event=', event)
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
    dispatch(settingsActions.routeTo({ url: '/overview' }))
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
