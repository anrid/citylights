'use strict'

import * as types from '../actions/actionTypes'

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

export default function users (state = initialState, action = {}) {
  let n
  switch (action.type) {
    case types.RECEIVE_USER:
      const { user } = action.payload
      n = { ...state }
      n.order = n.order.concat(user._id)
      n.data[user._id] = user
      return n

    default:
      return state
  }
}
