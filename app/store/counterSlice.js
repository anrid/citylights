'use strict'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  count: 0
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1
    },
    decrement: (state) => {
      state.count -= 1
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload
    }
  }
})

// Export actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// Export reducer
export default counterSlice.reducer