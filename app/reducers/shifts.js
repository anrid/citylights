'use strict'

import Moment from 'moment'

import * as types from '../actions/actionTypes'

const initialState = {
  order: ['SF1', 'SF2', 'SF3', 'SF4'],
  data: {
    SF1: {
      _id: 'SF1',
      assignees: [],
      startDate: '2016-06-02 10:00:00',
      endDate: '2016-06-02 18:00:00'
    },
    SF2: {
      _id: 'SF2',
      assignees: [],
      startDate: '2016-06-02 15:00:00',
      endDate: '2016-06-04 18:00:00'
    },
    SF3: {
      _id: 'SF3',
      assignees: [],
      startDate: '2016-06-04 10:00:00',
      endDate: '2016-06-10 18:00:00'
    },
    SF4: {
      _id: 'SF4',
      assignees: [],
      startDate: '2016-06-03 10:00:00',
      endDate: '2016-06-03 18:00:00'
    }
  }
}

export default function shifts (state = initialState, action = {}) {
  let n
  switch (action.type) {
    case types.RECEIVE_SHIFT:
      const { shift } = action.payload
      n = { ...state }
      n.order = n.order.concat(shift._id)
      n.order = [ ...new Set(n.order) ] // Ensure it’s unique.

      n.data[shift._id] = shift
      return n

    case types.RECEIVE_SHIFT_LIST:
      const { shiftList } = action.payload
      n = { ...state }

      // Replace all local state.
      n.order = shiftList.map((x) => x._id)
      n.order = [ ...new Set(n.order) ]
      n.order.sort()

      n.data = shiftList.reduce((acc, x) => {
        acc[x._id] = x
        return acc
      }, { })
      return n

    default:
      return state
  }
}
