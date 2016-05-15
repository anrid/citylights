'use strict'

import * as types from '../actions/actionTypes'

const initialState = {
  order: [],
  data: { }
}

export default function workspaces (state = initialState, action = {}) {
  let n
  switch (action.type) {
    case types.RECEIVE_WORKSPACE:
      const { workspace } = action.payload
      n = { ...state }

      n.order = n.order.concat(workspace._id)
      n.order = [ ...new Set(n.order) ] // Ensure it’s unique.

      n.data[workspace._id] = workspace
      return n

    case types.RECEIVE_WORKSPACE_LIST:
      const { workspaceList } = action.payload
      n = { ...state }

      n.order = n.order.concat(workspaceList.map((x) => x._id))
      n.order = [ ...new Set(n.order) ] // Ensure it’s unique.

      n.data = workspaceList.reduce((acc, x) => {
        acc[x._id] = x
        return acc
      }, n.data)
      return n

    default:
      return state
  }
}
