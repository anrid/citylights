'use strict'

import Moment from 'moment'

export function createDatesFromWeekStart (opts) {
  let count = 0
  let dayCount = 0

  const startDate = Moment(opts.pivotDate).startOf('isoWeek')

  return [ ...new Array(opts.size) ].map(() => {
    ++count
    if (opts.preview) {
      return null
    }
    ++dayCount
    if (opts.skipWeekends && dayCount === 5) {
      count += 2
      dayCount = 0
      return startDate.clone().add(count - 3, 'days').format()
    }
    return startDate.clone().add(count - 1, 'days').format()
  })
}

export function getDateRangeString (from, to) {
  const fromDate = Moment(from).format('MMM D')
  const fromTime = Moment(to).format('HH:mm')
  const toDate = Moment(to).format('MMM D')
  const toTime = Moment(to).format('HH:mm')
  if (fromDate === toDate) {
    return `${fromDate} ${fromTime} — ${toTime}`
  }
  return `${fromDate} ${fromTime} — ${toDate} ${toTime}`
}

export function getDateAsOffsetFromDate (_from, units, unit, skipWeekends) {
  const from = Moment(_from)
  if (!skipWeekends) {
    return from.clone().add(units, unit)
  }

  let total = 0
  let dayCount = 0
  for (let i = 0; i < units; ++i) {
    ++total
    ++dayCount
    // Skip weekends when unit is `days`
    if (unit === 'days' && dayCount === 5) {
      total += 2
      dayCount = 0
    }
  }
  return from.clone().add(total, unit)
}

export function getDiff (_from, _to, unit, skipWeekends) {
  let from = Moment(_from)
  let to = Moment(_to)

  // Expect `from` to be same or before `to`.
  if (!from.isSameOrBefore(to)) {
    let tmp = from
    from = to
    to = tmp
  }

  const diff = Math.abs(from.diff(to, unit))
  let units = 0

  for (let i = 0; i < diff; ++i) {
    if (skipWeekends) {
      let weekDay = from.clone().add(i, unit).isoWeekday()
      if (weekDay === 6 || weekDay === 7) {
        continue
      }
    }
    ++units
  }
  return units
}
