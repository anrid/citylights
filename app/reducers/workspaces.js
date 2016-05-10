'use strict'

import * as types from '../actions/actionTypes'

const initialState = {
  order: ['SPACE1', 'SPACE2'],
  data: {
    SPACE1: {
      _id: 'SPACE1',
      url: 'taskworld.com',
      name: 'Taskworld.com',
      ownerId: 'USER1'
    },
    SPACE2: {
      _id: 'SPACE2',
      url: 'ace-of-base',
      name: 'Ace of Base',
      ownerId: 'USER1'
    }
  }
}

export default function workspaces (state = initialState, action = {}) {
  let n
  switch (action.type) {
    case types.RECEIVE_WORKSPACE:
      const { workspace } = action.payload
      n = { ...state }
      n.order = n.order.concat(workspace._id)
      n.data[workspace._id] = workspace
      return n

    case types.RECEIVE_WORKSPACE_LIST:
      const { workspaceList } = action.payload
      n = { ...state }
      n.order = workspaceList.map((x) => x._id)
      n.data = workspaceList.reduce((acc, x) => {
        acc[x._id] = x
        return acc
      }, n.data)
      return n

    default:
      return state
  }
}
