'use strict'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  order: [],
  data: {}
}

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    receiveWorkspace: (state, action) => {
      const { workspace } = action.payload
      
      // Add to order if not already present
      if (!state.order.includes(workspace._id)) {
        state.order.push(workspace._id)
      }
      
      // Update data
      state.data[workspace._id] = workspace
    },
    receiveWorkspaceList: (state, action) => {
      const { workspaceList } = action.payload
      
      // Update order with new IDs
      const newIds = workspaceList.map(x => x._id)
      newIds.forEach(id => {
        if (!state.order.includes(id)) {
          state.order.push(id)
        }
      })
      
      // Update data
      workspaceList.forEach(workspace => {
        state.data[workspace._id] = workspace
      })
    },
    updateWorkspace: (state, action) => {
      const { workspaceId, updates } = action.payload
      if (state.data[workspaceId]) {
        Object.assign(state.data[workspaceId], updates)
      }
    }
  }
})

// Export actions
export const { receiveWorkspace, receiveWorkspaceList, updateWorkspace } = workspacesSlice.actions

// Export reducer
export default workspacesSlice.reducer