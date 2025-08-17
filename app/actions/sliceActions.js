'use strict'

// Import all slice actions
import {
  setSetting,
  setRoute,
  incSetting,
  setIdentity,
  clearIdentity,
  setServerStatus,
  setRequestStatus,
  setAppLoadingStatus,
  openPropertiesPanel,
  closePropertiesPanel,
  setSavedSetting,
  setSearchFilters,
  setServerError,
  clearServerError
} from '../store/settingsSlice'

import {
  receiveWorkspace,
  receiveWorkspaceList,
  updateWorkspace
} from '../store/workspacesSlice'

import {
  receiveUser,
  receiveUserList,
  updateUser,
  updateUserWorkProfile,
  assignConsultant
} from '../store/usersSlice'

import {
  createProject,
  updateProject,
  removeProject,
  receiveProject,
  receiveProjectList,
  toggleProjectMember
} from '../store/projectsSlice'

import {
  createShift,
  updateShift,
  removeShift,
  receiveShift,
  receiveShiftList
} from '../store/shiftsSlice'

import {
  increment,
  decrement,
  incrementByAmount
} from '../store/counterSlice'

// Export all actions for easy importing
export {
  // Settings actions
  setSetting,
  setRoute,
  incSetting,
  setIdentity,
  clearIdentity,
  setServerStatus,
  setRequestStatus,
  setAppLoadingStatus,
  openPropertiesPanel,
  closePropertiesPanel,
  setSavedSetting,
  setSearchFilters,
  setServerError,
  clearServerError,
  
  // Workspace actions
  receiveWorkspace,
  receiveWorkspaceList,
  updateWorkspace,
  
  // User actions
  receiveUser,
  receiveUserList,
  updateUser,
  updateUserWorkProfile,
  assignConsultant,
  
  // Project actions
  createProject,
  updateProject,
  removeProject,
  receiveProject,
  receiveProjectList,
  toggleProjectMember,
  
  // Shift actions
  createShift,
  updateShift,
  removeShift,
  receiveShift,
  receiveShiftList,
  
  // Counter actions
  increment,
  decrement,
  incrementByAmount
}

// Create compatibility mappings for old action types
export const actionTypeMapping = {
  'SET_SETTING': setSetting,
  'SET_ROUTE': setRoute,
  'INC_SETTING': incSetting,
  'SET_IDENTITY': setIdentity,
  'CLEAR_IDENTITY': clearIdentity,
  'RECEIVE_WORKSPACE': receiveWorkspace,
  'RECEIVE_WORKSPACE_LIST': receiveWorkspaceList,
  'RECEIVE_USER': receiveUser,
  'RECEIVE_USER_LIST': receiveUserList,
  'UPDATE_USER': updateUser,
  'UPDATE_USER_WORK_PROFILE': updateUserWorkProfile,
  'ASSIGN_CONSULTANT': assignConsultant,
  'CREATE_PROJECT': createProject,
  'UPDATE_PROJECT': updateProject,
  'REMOVE_PROJECT': removeProject,
  'RECEIVE_PROJECT': receiveProject,
  'RECEIVE_PROJECT_LIST': receiveProjectList,
  'TOGGLE_PROJECT_MEMBER': toggleProjectMember,
  'CREATE_SHIFT': createShift,
  'UPDATE_SHIFT': updateShift,
  'REMOVE_SHIFT': removeShift,
  'RECEIVE_SHIFT': receiveShift,
  'RECEIVE_SHIFT_LIST': receiveShiftList,
  'INCREMENT': increment,
  'DECREMENT': decrement
}