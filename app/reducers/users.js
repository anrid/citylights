'use strict'

import * as types from '../actions/actionTypes'
import Moment from 'moment'

const initialState = {
  order: ['USER1'],
  randomAvatars: {
    AVA1: { _id: 'AVA1', firstName: 'Sara', lastName: 'Larzson', url: 'https://c2.staticflickr.com/8/7234/7300036942_c1679ee443_t.jpg' },
    AVA2: { _id: 'AVA2', firstName: 'Ylva', lastName: 'Jönsson', url: 'https://c2.staticflickr.com/8/7218/7402376150_6b508dff90_t.jpg' },
    AVA3: { _id: 'AVA3', firstName: 'Eva', lastName: 'Strand', url: 'https://c1.staticflickr.com/7/6192/6123912393_46a4da7795_t.jpg' },
    AVA4: { _id: 'AVA4', firstName: 'Jessica', lastName: 'Alba', url: 'https://c1.staticflickr.com/9/8464/8415646985_f10e90b893_q.jpg' },
    AVA5: { _id: 'AVA5', firstName: 'Rut', lastName: 'Svedkvist', url: 'https://c1.staticflickr.com/7/6162/6199777163_17d444259b_t.jpg' },
    AVA6: { _id: 'AVA6', firstName: 'Josefin', lastName: 'Sjöberg', url: 'https://c2.staticflickr.com/6/5185/5771365116_86fed7a801_q.jpg' },
    AVA7: { _id: 'AVA7', firstName: 'Anna', lastName: 'Wahlberg', url: 'https://c2.staticflickr.com/6/5253/5416395598_cf8b3890c9_q.jpg' }
  },
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
      n.order = [ ...new Set(n.order) ] // Ensure it’s unique.
      n.data[user._id] = user
      return n

    case types.RECEIVE_USER_LIST:
      const { userList } = action.payload
      n = { ...state }

      // Replace all local state.
      n.order = userList.map((x) => x._id)
      n.order = [ ...new Set(n.order) ]
      n.order.sort()

      const avatarCount = Object.keys(state.randomAvatars).length

      n.data = userList.reduce((acc, x) => {
        acc[x._id] = x
        const avatarIndex = (Moment(x.created).unix() % avatarCount) + 1
        const avatar = state.randomAvatars[`AVA${avatarIndex}`]

        // TODO: Remove this later !
        // Set a temp avatar if user doesn’t have one yet !
        if (!x.photo) {
          x.photo = avatar.url
        }

        // TODO: Remove this later !
        // Set a temp name if none is set
        if (!x.firstName && !x.lastName) {
          x.firstName = avatar.firstName
          x.lastName = avatar.lastName
        }

        return acc
      }, { })
      return n

    default:
      return state
  }
}
