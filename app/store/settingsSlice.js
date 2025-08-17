'use strict'

import { createSlice } from '@reduxjs/toolkit'
import * as Storage from '../lib/storage'

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

  isPropertiesPanelOpen: false,
  propertiesPanelData: null,

  saved: {
    email: null,
    workspaceId: null,
    activeTheme: 'BG4' // Default theme is BG4, i.e. "Reading Comics".
  },
  search: {
    consultants: null,
    clients: null,
    projects: null
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

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSetting: (state, action) => {
      Object.assign(state, action.payload)
    },
    setRoute: (state, action) => {
      const route = action.payload.route
      Object.assign(state, route)
    },
    incSetting: (state, action) => {
      const key = Object.keys(action.payload)[0]
      const value = action.payload[key]
      if (!state[key]) {
        state[key] = 0
      }
      state[key] += value
    },
    setIdentity: (state, action) => {
      state.identity = action.payload
    },
    clearIdentity: (state) => {
      state.identity = null
    },
    setServerStatus: (state, action) => {
      state.isConnectedToServer = action.payload.connected
      state.isWaitingForServer = action.payload.waiting || false
    },
    setRequestStatus: (state, action) => {
      state.isRequestInProgress = action.payload
    },
    setAppLoadingStatus: (state, action) => {
      state.isAppLoading = action.payload.loading
      state.isAppLoaded = action.payload.loaded
    },
    openPropertiesPanel: (state, action) => {
      state.isPropertiesPanelOpen = true
      state.propertiesPanelData = action.payload
    },
    closePropertiesPanel: (state) => {
      state.isPropertiesPanelOpen = false
      state.propertiesPanelData = null
    },
    setSavedSetting: (state, action) => {
      Object.assign(state.saved, action.payload)
    },
    setSearchFilters: (state, action) => {
      Object.assign(state.search, action.payload)
    },
    setServerError: (state, action) => {
      state.serverError = action.payload
    },
    clearServerError: (state) => {
      state.serverError = null
    }
  }
})

// Export basic actions (excluding setIdentity and clearIdentity which we'll create as thunks)
export const {
  setSetting,
  setRoute,
  incSetting,
  setIdentity: setIdentityReducer,
  clearIdentity: clearIdentityReducer,
  setServerStatus,
  setRequestStatus,
  setAppLoadingStatus,
  openPropertiesPanel,
  closePropertiesPanel,
  setSavedSetting,
  setSearchFilters,
  setServerError,
  clearServerError
} = settingsSlice.actions

// Thunk action for setIdentity that also saves to localStorage
export const setIdentity = (identity) => (dispatch) => {
  // Save to localStorage
  Storage.setIdentity(identity)
  // Update Redux state
  dispatch(setIdentityReducer(identity))
}

// Thunk action for clearIdentity that also removes from localStorage
export const clearIdentity = () => (dispatch) => {
  // Remove from localStorage
  Storage.removeIdentity()
  // Update Redux state
  dispatch(clearIdentityReducer())
}

// Export reducer
export default settingsSlice.reducer