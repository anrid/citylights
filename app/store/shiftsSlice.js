'use strict'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  order: [],
  data: {}
}

const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    createShift: (state, action) => {
      const { shift } = action.payload
      
      if (!state.order.includes(shift._id)) {
        state.order.push(shift._id)
      }
      
      state.data[shift._id] = shift
    },
    updateShift: (state, action) => {
      const { shiftId, updates } = action.payload
      if (state.data[shiftId]) {
        Object.assign(state.data[shiftId], updates)
      }
    },
    removeShift: (state, action) => {
      const { shiftId } = action.payload
      
      // Remove from order
      state.order = state.order.filter(id => id !== shiftId)
      
      // Remove from data
      delete state.data[shiftId]
    },
    receiveShift: (state, action) => {
      const { shift } = action.payload
      
      if (!state.order.includes(shift._id)) {
        state.order.push(shift._id)
      }
      
      state.data[shift._id] = shift
    },
    receiveShiftList: (state, action) => {
      const { shiftList } = action.payload
      
      const newIds = shiftList.map(x => x._id)
      newIds.forEach(id => {
        if (!state.order.includes(id)) {
          state.order.push(id)
        }
      })
      
      shiftList.forEach(shift => {
        state.data[shift._id] = shift
      })
    }
  }
})

// Export actions
export const {
  createShift,
  updateShift,
  removeShift,
  receiveShift,
  receiveShiftList
} = shiftsSlice.actions

// Export reducer
export default shiftsSlice.reducer