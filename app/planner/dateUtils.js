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
  const fromTime = Moment(from).format('HH:mm')
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
  for (let i = 0; i < units; ++i) {
    ++total
    // Skip weekends when unit is `days`
    if (unit === 'days') {
      const weekday = from.clone().add(total, unit).isoWeekday()
      if (weekday === 6) {
        total += 2
      } else if (weekday === 7) {
        total += 1
      }
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

export function getShiftInfo (shift, _pivotDate) {
  const pivot = _pivotDate ? Moment(_pivotDate) : Moment()

  const start = Moment(shift.startDate)
  const end = Moment(shift.endDate)
  const shiftEnd = start.clone().hours(end.hours()).minutes(end.minutes())
  const shiftMinutes = Math.abs(start.diff(shiftEnd, 'minutes'))

  let fromPivotToStart = pivot.diff(start, 'minutes')
  let fromPivotToEnd = pivot.diff(end, 'minutes')

  let shiftMinutesCompleted = 0
  if (fromPivotToStart > 0) {
    // Shift starts before pivot.
    let completed = fromPivotToStart
    if (fromPivotToEnd > 0) {
      // Shift also ends before pivot. Deduct those minutes !
      completed -= fromPivotToEnd
    }
    // Gives us the total number of completed hours within part of the
    // shift range that’s before the pivot date.
    shiftMinutesCompleted = Math.floor(shiftMinutes * Math.ceil(completed / (60 * 24)))
  }

  let shiftMinutesPlanned = 0
  if (fromPivotToEnd < 0) {
    // Shift end after pivot.
    let planned = fromPivotToEnd
    if (fromPivotToStart < 0) {
      // Shift also starts after pivot. Deduct those minutes !
      planned -= fromPivotToStart
    }
    shiftMinutesPlanned = Math.floor(shiftMinutes * Math.ceil(Math.abs(planned) / (60 * 24)))
  }

  // console.log(`
  // Shift: ${shiftMinutes / 60}h
  //        ${shiftMinutesCompleted} completed
  //        ${shiftMinutesPlanned} planned
  // `)

  return {
    completed: shiftMinutesCompleted,
    planned: shiftMinutesPlanned,
    lengthMinutes: shiftMinutes
  }
}

export function minutesToFormattedHour (minutes) {
  return `${Math.floor(minutes / 60)}.${minutes % 60}`
}
