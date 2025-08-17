'use strict'

import * as types from '../actions/actionTypes'

const initialState = {
  order: [],
  data: { }
}

export default function workspaces (state = initialState, action = {}) {
  let n
  if (action.type !== '@@INIT' && action.type !== '@@redux/INIT' && !action.type.includes('@@router')) {
    console.log('workspaces reducer called with action:', action.type, action.payload)
  }
  switch (action.type) {
    case types.RECEIVE_WORKSPACE:
      const { workspace } = action.payload
      console.log('RECEIVE_WORKSPACE: processing workspace', workspace)
      n = { ...state }

      n.order = n.order.concat(workspace._id)
      n.order = [ ...new Set(n.order) ] // Ensure it's unique.

      n.data[workspace._id] = workspace
      console.log('RECEIVE_WORKSPACE: updated state', n)
      return n

    case types.RECEIVE_WORKSPACE_LIST:
      const { workspaceList } = action.payload
      console.log('RECEIVE_WORKSPACE_LIST: processing workspaces', workspaceList)
      n = { ...state }

      n.order = n.order.concat(workspaceList.map((x) => x._id))
      n.order = [ ...new Set(n.order) ] // Ensure it's unique.

      n.data = workspaceList.reduce((acc, x) => {
        acc[x._id] = x
        return acc
      }, n.data)
      console.log('RECEIVE_WORKSPACE_LIST: updated state', n)
      return n

    default:
      return state
  }
}
