'use strict'

import { push, pop } from 'react-router-redux'

import * as types from './actionTypes'
import { publicApiRequest } from './backendActions'
import { authenticate, request } from '../lib/apiClient'

import * as Storage from '../lib/storage'

export function restoreState (store) {
  // Load stored app state, including userId, email and accessToken.
  const identity = Storage.getIdentity()
  const saved = Storage.getSavedSettings()

  // Restore saved settings.
  if (saved) {
    store.dispatch({
      type: types.SET_SETTING,
      payload: { saved }
    })
  }

  // Restore identity.
  if (identity) {
    store.dispatch({
      type: types.SET_SETTING,
      payload: { identity }
    })
  }

  console.log('Restored app state:', store.getState())
}

export function initApp () {
  return (dispatch, getState) => {
    console.log('Initializing app.')
    const { identity } = getState().settings
    const hasValidIdentity = identity && identity.userId && identity.accessToken
    if (!hasValidIdentity) {
      dispatch(clearIdentity())
      return
    }
    console.log('Using existing identity:', identity)
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
    setAppLoaded(false)
    console.log('Fetching app starter for workspaceId:', workspaceId)
    request('app:starter', { workspaceId })
    .catch((error) => {
      console.log('Couldn’t fetch app starter! Bailing out with error=', error)
      dispatch(clearIdentity())
    })
  }
}

export function clearIdentity () {
  return (dispatch) => {
    // Remove from long-term storage.
    Storage.removeIdentity()
    // Clear identity until next successful login.
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
    dispatch(publicApiRequest('signup', { companyName, email }))
  }
}

export function login (email, password) {
  return (dispatch) => {
    dispatch(showServerError(null))
    authenticate(email, password)
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
  return {
    type: types.SET_SETTING,
    payload: {
      isPropertiesPanelOpen: true,
      propertiesPanelData: {
        type: 'consultant',
        userId
      }
    }
  }
}

export function setPropertiesPanelOpen (value) {
  return {
    type: types.SET_SETTING,
    payload: {
      isPropertiesPanelOpen: value
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
