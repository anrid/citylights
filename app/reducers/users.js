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

export default function users (state = initialState, action = {}) {
  let n
  switch (action.type) {
    case types.RECEIVE_USER:
      const { user } = action.payload
      n = { ...state }
      n.order = n.order.concat(user._id)
      n.order = [ ...new Set(n.order) ] // Ensure it’s unique.

      // fillInMissingUserInfo(user)
      setDefaults(user)

      n.data[user._id] = user
      return n

    case types.RECEIVE_USER_LIST:
      const { userList } = action.payload
      n = { ...state }

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

    default:
      return state
  }
}
