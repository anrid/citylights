'use strict'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  order: [],
  data: {}
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    receiveUser: (state, action) => {
      const { user } = action.payload
      
      if (!state.order.includes(user._id)) {
        state.order.push(user._id)
      }
      
      state.data[user._id] = user
    },
    receiveUserList: (state, action) => {
      const { userList } = action.payload
      
      const newIds = userList.map(x => x._id)
      newIds.forEach(id => {
        if (!state.order.includes(id)) {
          state.order.push(id)
        }
      })
      
      userList.forEach(user => {
        state.data[user._id] = user
      })
    },
    updateUser: (state, action) => {
      const { userId, updates } = action.payload
      if (state.data[userId]) {
        Object.assign(state.data[userId], updates)
      }
    },
    updateUserWorkProfile: (state, action) => {
      const { userId, workProfile } = action.payload
      if (state.data[userId]) {
        state.data[userId].workProfile = {
          ...state.data[userId].workProfile,
          ...workProfile
        }
      }
    },
    assignConsultant: (state, action) => {
      const { consultantId, projectId } = action.payload
      if (state.data[consultantId]) {
        if (!state.data[consultantId].projects) {
          state.data[consultantId].projects = []
        }
        if (!state.data[consultantId].projects.includes(projectId)) {
          state.data[consultantId].projects.push(projectId)
        }
      }
    }
  }
})

// Export actions
export const {
  receiveUser,
  receiveUserList,
  updateUser,
  updateUserWorkProfile,
  assignConsultant
} = usersSlice.actions

// Export reducer
export default usersSlice.reducer