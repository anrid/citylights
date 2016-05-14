'use strict'

import { push, pop } from 'react-router-redux'

import * as types from './actionTypes'
import {
  send,
  request
} from '../lib/apiClient'

import * as Storage from '../lib/storage'

export function restoreState (store) {
  // Load stored app state, including userId, email and accessToken.
  const identity = Storage.getIdentity()
  const saved = Storage.getSavedSettings()

  // Restore saved settings.
  if (saved) {
    console.log('Restoring saved:', saved)
    store.dispatch({
      type: types.SET_SETTING,
      payload: { saved }
    })
  }

  // Restore identity.
  if (identity) {
    console.log('Restoring identity:', identity)
    store.dispatch({
      type: types.SET_SETTING,
      payload: { identity }
    })
  }

  console.log('Restored saved state:', store.getState())
}

export function initApp () {
  return (dispatch, getState) => {
    console.log('Initializing app.')
    const { identity } = getState().settings
    if (identity && identity.userId && identity.accessToken) {
      console.log('Using existing identity:', identity)
      dispatch(validateToken(identity.accessToken))
    } else {
      dispatch(clearIdentity())
    }
  }
}

export function saveSettings (settings = { }) {
  return (dispatch, getState) => {
    const saved = Object.assign({ }, getState().settings.saved, settings)
    dispatch({
      type: types.SET_SETTING,
      payload: { saved }
    })
    Storage.setSavedSettings(saved)
  }
}

export function setIdentity (userId, accessToken) {
  return (dispatch, getState) => {
    const identity = { userId, accessToken }
    // Save for a long time.
    Storage.setIdentity(identity)

    // Dispatch !
    dispatch({
      type: types.SET_IDENTITY,
      payload: identity
    })

    const { saved } = getState().settings
    dispatch(fetchAppStarter(saved.workspaceId))
  }
}

export function fetchAppStarter (workspaceId) {
  return (dispatch) => {
    setAppLoaded(false)
    const payload = { workspaceId }
    console.log('Fetching app starter:', payload)
    send('app:starter', payload)
  }
}

export function clearIdentity () {
  return (dispatch) => {
    // Remove from AsyncStorage.
    Storage.removeIdentity()

    // Dispatch !
    dispatch({
      type: types.CLEAR_IDENTITY,
      payload: { }
    })

    // Go to login page.
    dispatch(routeTo({ url: '/login' }))
  }
}

export function signup (companyName, email) {
  return (dispatch) => {
    dispatch(showServerError(null))
    request('signup', { companyName, email })
  }
}

export function login (email, password) {
  return (dispatch) => {
    dispatch(showServerError(null))
    request('auth', { email, password })
  }
}

export function validateToken (accessToken) {
  return (dispatch) => {
    dispatch(showServerError(null))
    send('auth:token', { accessToken })
  }
}

export function routeTo (_route) {
  return (dispatch, getState) => {
    // Support routing to a route name given as a string.
    const route = typeof _route === 'string' ? { url: _route } : _route
    console.log('Routing to:', route)

    // Always reset server error messages between routes.
    dispatch(showServerError(null))
    if (route.back) {
      dispatch(pop())
    } else {
      dispatch(push(route.url))
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

export function showServerError (error) {
  return {
    type: types.SET_SETTING,
    payload: {
      serverError: error
    }
  }
}

export function increaseEchoCounter () {
  return {
    type: types.INC_SETTING,
    payload: {
      echos: 1
    }
  }
}
