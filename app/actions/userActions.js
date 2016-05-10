'use strict'

import * as settingsActions from './settingsActions'
import * as types from './actionTypes'
import { request } from '../lib/apiClient'

export function inviteUser (name) {
  return (dispatch) => {
    dispatch(settingsActions.showServerError(null))
    request('user:create', { name })
  }
}

export function receiveUser (user) {
  return {
    type: types.RECEIVE_USER,
    payload: { user }
  }
}

export function receiveUserList (userList) {
  return {
    type: types.RECEIVE_USER_LIST,
    payload: { userList }
  }
}
