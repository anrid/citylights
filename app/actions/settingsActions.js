'use strict'

// Modern React Router v6 navigation will be handled differently
// import { push, pop } from 'react-router-redux' // Deprecated - removed

import * as types from './actionTypes'
import { apiRequest } from './backendActions'
import { request } from '../lib/apiClient'
import { setSavedSetting, openPropertiesPanel, closePropertiesPanel } from '../store/settingsSlice'

import * as Storage from '../lib/storage'
import { setSetting, setIdentity as setIdentityAction, clearIdentity as clearIdentityAction, setAppLoadingStatus } from '../store/settingsSlice'

export function restoreState (store) {
  // Load stored app state, including userId, email and accessToken.
  const identity = Storage.getIdentity()
  const saved = Storage.getSavedSettings()

  // Restore saved settings.
  if (saved) {
    store.dispatch(setSetting({ saved }))
  }

  // Restore identity.
  if (identity) {
    store.dispatch(setSetting({ identity }))
  }

  console.log('Restored app state:', store.getState())
}

export function initApp () {
  return (dispatch, getState) => {
    console.log('Initializing app.')
    const { identity } = getState().settings
    console.log('Identity from state:', identity)
    console.log('Identity check - has identity:', !!identity, 'has userId:', !!(identity && identity.userId), 'has accessToken:', !!(identity && identity.accessToken))
    const hasValidIdentity = identity && identity.userId && identity.accessToken
    if (!hasValidIdentity) {
      console.log('Identity validation failed, clearing identity')
      dispatch(clearIdentity())
      return
    }
    console.log('Using stored identity, user id:', identity.userId)
  }
}

export function saveSettings (settings = { }) {
  return (dispatch, getState) => {
    const saved = Object.assign({ }, getState().settings.saved, settings)
    console.log('saveSettings: merging', settings, 'with existing', getState().settings.saved, 'result:', saved)
    dispatch(setSavedSetting(settings))
    Storage.setSavedSettings(saved)
    console.log('saveSettings: saved to localStorage')
  }
}

export function setIdentity (payload) {
  return (dispatch, getState) => {
    // Stay a while... Stay Forever !
    Storage.setIdentity(payload.identity)
    // Set our identity here.
    dispatch({
      type: types.SET_IDENTITY,
      payload: payload.identity
    })
  }
}

export function fetchAppStarter (workspaceId) {
  return (dispatch) => {
    dispatch(setAppLoadingStatus({ loading: true, loaded: false }))
    console.log('Fetching app starter for workspace id:', workspaceId)
    return request('app:starter', { workspaceId }, { buffer: false })
    .catch((error) => {
      console.log('Could not fetch app starter! Bailing out with error=', error)
      dispatch(clearIdentity())
    })
  }
}

export function clearIdentity () {
  return (dispatch) => {
    // Remove from long-term storage.
    Storage.removeIdentity()
    // Clear identity until next successful login.
    dispatch(clearIdentityAction())
    // Let React Router handle navigation to login - ProtectedRoute will redirect when identity is null
    console.log('Identity cleared, user will be redirected to login by ProtectedRoute')
  }
}

export function signup (data) {
  return (dispatch) => {
    dispatch(showServerError(null))
    dispatch(apiRequest('signup', data, { buffer: false }))
  }
}

export function login (email, password) {
  return (dispatch) => {
    dispatch(showServerError(null))
    dispatch(apiRequest('auth', { email, password }, { buffer: false }))
  }
}

export function routeTo (_route) {
  return (dispatch, getState) => {
    // Support routing to a route name given as a string.
    const route = typeof _route === 'string' ? { url: _route } : _route
    console.log('Routing to:', route)

    // Always reset server error messages between routes.
    dispatch(showServerError(null))
    
    // Modern React Router v6 navigation using window.location
    if (route.back) {
      window.history.back()
    } else {
      console.log('Navigating to:', route.url)
      window.location.href = route.url
    }
  }
}

export function routeBack () {
  return routeTo({ back: true })
}

export function setNavigator (navigator) {
  return {
    type: types.SET_SETTING,
    payload: { navigator }
  }
}

export function setAppLoaded (status) {
  return {
    type: types.SET_SETTING,
    payload: {
      isAppLoading: !status,
      isAppLoaded: status
    }
  }
}

export function setConnectedToServer (status) {
  return {
    type: types.SET_SETTING,
    payload: {
      isConnectedToServer: status
    }
  }
}

export function setWaitingForServer (status) {
  return {
    type: types.SET_SETTING,
    payload: {
      isWaitingForServer: status
    }
  }
}

export function setRequestInProgress (status) {
  return {
    type: types.SET_SETTING,
    payload: {
      isRequestInProgress: status
    }
  }
}

export function setSearchQuery (obj) {
  return (dispatch, getState) => {
    const search = Object.assign(
      { }, getState().settings.search, obj
    )
    dispatch({
      type: types.SET_SETTING,
      payload: { search }
    })
  }
}

export function showServerError (error) {
  return {
    type: types.SET_SETTING,
    payload: {
      serverError: error
    }
  }
}

export function showConsultantProperties (userId) {
  return openPropertiesPanel({
    type: 'consultant',
    userId
  })
}

export function showShiftProperties (shiftId) {
  return openPropertiesPanel({
    type: 'shift',
    shiftId
  })
}

export function showProjectProperties (projectId) {
  return openPropertiesPanel({
    type: 'project',
    projectId
  })
}

export function setPropertiesPanelOpen (value) {
  return value ? openPropertiesPanel({}) : closePropertiesPanel()
}

export function increaseEchoCounter () {
  return {
    type: types.INC_SETTING,
    payload: {
      echos: 1
    }
  }
}
