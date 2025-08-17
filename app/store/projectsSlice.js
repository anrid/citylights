'use strict'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  order: [],
  data: {}
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action) => {
      const { project } = action.payload
      
      if (!state.order.includes(project._id)) {
        state.order.push(project._id)
      }
      
      state.data[project._id] = project
    },
    updateProject: (state, action) => {
      const { projectId, updates } = action.payload
      if (state.data[projectId]) {
        Object.assign(state.data[projectId], updates)
      }
    },
    removeProject: (state, action) => {
      const { projectId } = action.payload
      
      // Remove from order
      state.order = state.order.filter(id => id !== projectId)
      
      // Remove from data
      delete state.data[projectId]
    },
    receiveProject: (state, action) => {
      const { project } = action.payload
      
      if (!state.order.includes(project._id)) {
        state.order.push(project._id)
      }
      
      state.data[project._id] = project
    },
    receiveProjectList: (state, action) => {
      const { projectList } = action.payload
      
      const newIds = projectList.map(x => x._id)
      newIds.forEach(id => {
        if (!state.order.includes(id)) {
          state.order.push(id)
        }
      })
      
      projectList.forEach(project => {
        state.data[project._id] = project
      })
    },
    toggleProjectMember: (state, action) => {
      const { projectId, userId } = action.payload
      
      if (state.data[projectId]) {
        if (!state.data[projectId].members) {
          state.data[projectId].members = []
        }
        
        const members = state.data[projectId].members
        const index = members.indexOf(userId)
        
        if (index > -1) {
          members.splice(index, 1)
        } else {
          members.push(userId)
        }
      }
    }
  }
})

// Export actions
export const {
  createProject,
  updateProject,
  removeProject,
  receiveProject,
  receiveProjectList,
  toggleProjectMember
} = projectsSlice.actions

// Export reducer
export default projectsSlice.reducer