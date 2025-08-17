'use strict'

// Import all slices
import counterReducer from './counterSlice'
import settingsReducer from './settingsSlice'
import workspacesReducer from './workspacesSlice'
import usersReducer from './usersSlice'
import projectsReducer from './projectsSlice'
import shiftsReducer from './shiftsSlice'

// Export reducers in the same format as the old reducers/index.js
const rootReducer = {
  counter: counterReducer,
  settings: settingsReducer,
  workspaces: workspacesReducer,
  users: usersReducer,
  projects: projectsReducer,
  shifts: shiftsReducer
}

export default rootReducer

// Also export all slice actions for easy importing
export * from './counterSlice'
export * from './settingsSlice'
export * from './workspacesSlice'
export * from './usersSlice'
export * from './projectsSlice'
export * from './shiftsSlice'