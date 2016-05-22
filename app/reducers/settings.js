'use strict'

import * as types from '../actions/actionTypes'

const initialState = {
  isConnectedToServer: false,
  isWaitingForServer: false,
  isRequestInProgress: false,
  echos: 0,
  identity: null,
  route: null,
  navigator: null,
  isAppLoading: true,
  isAppLoaded: false,
  isPropertiesPanelOpen: true,
  propertiesPanelData: {
    type: 'consultant',
    userId: '573fe9c254ee58ce1d557a35'
  },
  saved: {
    email: null,
    workspaceId: null,
    activeTheme: 'BG4' // Default theme is BG4, i.e. “Reading Comics”.
  },
  search: {
    consultants: null,
    clients: null
  },
  backgrounds: {
    BG1: { _id: 'BG1', title: 'Tokyo Tower', url: 'https://c2.staticflickr.com/8/7332/13907706121_b1606f09b2_o.jpg' },
    BG2: { _id: 'BG2', title: 'Train Tracks', compact: true, url: 'https://c2.staticflickr.com/8/7296/8723330484_f624b5940b_o.jpg' },
    BG3: { _id: 'BG3', title: 'Paperman', url: 'https://c2.staticflickr.com/8/7217/7311315660_02f12229e7_k.jpg' },
    BG4: { _id: 'BG4', title: 'Reading Comics', url: 'https://c1.staticflickr.com/9/8233/8510765420_19be56a375_b.jpg' },
    BG5: { _id: 'BG5', title: 'Starbucks At Night', url: 'https://c1.staticflickr.com/9/8626/16092073333_59fe6924b2_h.jpg' },
    BG6: { _id: 'BG6', title: 'Cinnamon Rolls', url: 'https://c2.staticflickr.com/8/7022/6543926217_6fe23834d9_b.jpg' },
    BG7: { _id: 'BG7', title: 'Stockholm Pagoda', compact: true, url: 'https://c2.staticflickr.com/8/7378/14164486735_d878d82af6_h.jpg' },
    BG8: { _id: 'BG8', title: 'Flat — Blue', url: null, color: '#1b70b9' }
  }
}

export default function settings (state = initialState, action = { }) {
  switch (action.type) {
    case types.SET_SETTING:
      return { ...state, ...action.payload }

    case types.SET_ROUTE:
      const route = action.payload.route
      return { ...state, ...route }

    case types.INC_SETTING:
      const key = Object.keys(action.payload)[0]
      const value = action.payload[key]
      const newState = { ...state }
      if (!newState[key]) {
        newState[key] = 0
      }
      newState[key] += value
      return newState

    case types.SET_IDENTITY:
      return {
        ...state,
        identity: {
          ...action.payload
        }
      }

    case types.CLEAR_IDENTITY:
      return {
        ...state,
        identity: null
      }

    default:
      return state
  }
}
