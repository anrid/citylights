'use strict'

import metaphone from 'metaphone'
import { createSelector } from 'reselect'

function getSwedishMetaphoneValue (value) {
  if (value == null || !value.length) {
    return ''
  }
  let adjusted = value
  .replace(/[åÅ]/g, 'aa')
  .replace(/[äÄ]/g, 'ae')
  .replace(/[öÖ]/g, 'oe')
  return metaphone(adjusted)
}

function filterUsers (users, query) {
  // Use '==' to check if query is either undefined or null
  if (query == null || !query.length) {
    return users
  }
  let filtered = null
  // Filter users against each word in the query string,
  // i.e. we want users that match all subqueries !
  const parts = query.trim().split(/[\t\s]+/)
  for (const part of parts) {
    const re = new RegExp('^' + part, 'i')
    const queryMeta = getSwedishMetaphoneValue(part)

    // TODO: For each subquery, exclude previously matched field !
    filtered = users.filter((x) => {
      if (x.firstName && re.test(x.firstName)) return true
      if (x.lastName && re.test(x.lastName)) return true
      if (x._firstNameMeta && queryMeta === x._firstNameMeta) return true
      if (x._lastNameMeta && queryMeta === x._lastNameMeta) return true
      if (x.email && re.test(x.email)) return true
      return false
    })
  }
  return filtered
}

function sortByName (a, b) {
  const nameA = `${a.firstName} ${a.lastName}`
  const nameB = `${b.firstName} ${b.lastName}`
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }
  // names must be equal
  return 0
}

const allUsersSelector = (state) => {
  const all = Object.keys(state.users.data).map((x) => {
    const user = Object.assign({ }, state.users.data[x])
    user._firstNameMeta = getSwedishMetaphoneValue(user.firstName)
    user._lastNameMeta = getSwedishMetaphoneValue(user.lastName)
    return user
  })
  all.sort(sortByName)
  return all
}

const searchConsultantsQuerySelector = (state) => state.settings.search.consultants
const searchConsultantsInputWidgetQuerySelector = (state) => state.settings.search.consultantsInputWidget

export const filteredConsultantsSelector = createSelector(
  allUsersSelector,
  searchConsultantsQuerySelector,
  filterUsers
)

export const filteredConsultantsInputWidgetSelector = createSelector(
  allUsersSelector,
  searchConsultantsInputWidgetQuerySelector,
  filterUsers
)

export const consultantItemsSelector = createSelector(
  filteredConsultantsInputWidgetSelector,
  (filtered) => {
    return filtered.map((x, i) => (
      {
        _id: x._id,
        text: `${x.firstName} ${x.lastName}`,
        photo: x.photo,
        sub: x.profile && x.profile.title,
        type: 'user'
      }
    ))
  }
)
