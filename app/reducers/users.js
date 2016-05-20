'use strict'

import * as types from '../actions/actionTypes'
import {
  getRandomFirstName,
  getRandomLastName,
  getRandomAvatar
} from './generators/names'

const initialState = {
  order: ['USER1'],
  data: {
    USER1: {
      _id: 'USER1',
      firstName: 'Ace',
      LastName: 'Base',
      email: 'ace@base.com',
      photo: 'http://pickaface.net/includes/themes/clean/img/slide2.png'
    }
  }
}

function fillInMissingUserInfo (user) {
  // Set a temp avatar if user doesn’t have one yet !
  if (!user.photo) {
    user.photo = getRandomAvatar(user.created)
  }
  if (!user.firstName && !user.lastName) {
    user.firstName = getRandomFirstName(user.created)
    user.lastName = getRandomLastName(user.email)
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

      // TODO: Remove this later !
      fillInMissingUserInfo(user)

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
        // TODO: Remove this later !
        fillInMissingUserInfo(x)

        acc[x._id] = x
        return acc
      }, { })
      return n

    default:
      return state
  }
}
