'use strict'

import Moment from 'moment'

import * as types from '../actions/actionTypes'
import {
  getRandomFirstName,
  getRandomLastName,
  getRandomAvatar,
  getRandomConsultantTitle,
  getDefaultAvatar
} from './generators/names'

const initialState = {
  order: [],
  data: { }
}

export function fillInMissingUserInfo (user) {
  // Set a temp avatar if user doesn’t have one yet !
  if (!user.photo) {
    user.photo = getRandomAvatar(user.created)
  }
  if (!user.firstName && !user.lastName) {
    user.firstName = getRandomFirstName(user.created)
    user.lastName = getRandomLastName(user.email)
  }
  if (!user.profile) {
    const from20to35 = Moment(user.created).unix() % 15
    user.profile = {
      title: getRandomConsultantTitle(user.created),
      age: Math.floor(Math.random() * from20to35) + 20
    }
  }
}

export function setDefaults (user) {
  if (!user.profile.photo) {
    user.profile.photo = getDefaultAvatar()
  }
}

function updateUser (state, payload) {
  const n = { ...state }
  const { userId, key, value } = payload
  const updated = { ...state.data[userId] }
  updated[key] = value
  updated.updated = new Date()
  n.data[updated._id] = updated
  return n
}

function updateUserWorkProfile (state, payload) {
  const n = { ...state }
  const { userId, key, value } = payload
  const updated = { ...state.data[userId] }
  updated.profile = { ...updated.profile }
  updated.profile[key] = value
  n.data[updated._id] = updated
  return n
}

function receiveUser (state, payload) {
  const { user } = payload
  const n = { ...state }
  n.order = n.order.concat(user._id)
  n.order = [ ...new Set(n.order) ] // Ensure it’s unique.

  // fillInMissingUserInfo(user)
  setDefaults(user)

  n.data[user._id] = user
  return n
}

function receiveUserList (state, payload) {
  const { userList } = payload
  const n = { ...state }

  // Replace all local state.
  n.order = userList.map((x) => x._id)
  n.order = [ ...new Set(n.order) ]
  n.order.sort()

  n.data = userList.reduce((acc, x) => {
    // fillInMissingUserInfo(x)
    setDefaults(x)

    acc[x._id] = x
    return acc
  }, { })
  return n
}

export default function users (state = initialState, action = {}) {
  switch (action.type) {
    case types.UPDATE_USER:
      return updateUser(state, action.payload)
    case types.UPDATE_USER_WORK_PROFILE:
      return updateUserWorkProfile(state, action.payload)
    case types.RECEIVE_USER:
      return receiveUser(state, action.payload)
    case types.RECEIVE_USER_LIST:
      return receiveUserList(state, action.payload)
    default:
      return state
  }
}
