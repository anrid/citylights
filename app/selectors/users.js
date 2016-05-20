'use strict'

import metaphone from 'metaphone'
import { createSelector } from 'reselect'

function getSwedishMetaphoneValue (value) {
  let adjusted = value
  .replace(/[åÅ]/g, 'aa')
  .replace(/[äÄ]/g, 'ae')
  .replace(/[öÖ]/g, 'oe')
  return metaphone(adjusted)
}

const allUsersSelector = (state) => (
  Object.keys(state.users.data).map((x) => {
    const user = Object.assign({ }, state.users.data[x])
    user._firstNameMeta = getSwedishMetaphoneValue(user.firstName)
    user._lastNameMeta = getSwedishMetaphoneValue(user.lastName)
    return user
  })
)
const searchConsultantsQuerySelector = (state) => state.settings.search.consultants

export const filteredConsultantsSelector = createSelector(
  allUsersSelector,
  searchConsultantsQuerySelector,
  (users, query) => {
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
)
