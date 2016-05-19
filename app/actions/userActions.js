'use strict'

import * as types from './actionTypes'

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
