'use strict'

import { createSelector } from 'reselect'

function sortByDate (a, b) {
  if (a.startDate < b.startDate) {
    return -1
  }
  if (a.startDate > b.startDate) {
    return 1
  }
  return 0
}

const shiftsSortedByStartDateSelector = (state) => {
  const all = Object.keys(state.shifts.data).map((x) => {
    return Object.assign({ }, state.shifts.data[x])
  })
  all.sort(sortByDate)
  return all
}

export const projectsToShiftsMapSelector = createSelector(
  shiftsSortedByStartDateSelector,
  (all) => {
    return all.reduce((acc, x) => {
      if (!acc[x.projectId]) {
        acc[x.projectId] = []
      }
      acc[x.projectId].push(x)
      return acc
    }, { })
  }
)
