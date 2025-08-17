'use strict'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'

import './ShiftHours.scss'

import { getShiftInfo, minutesToFormattedHour } from './dateUtils'

function ShiftHours({ shifts }) {
  const totals = useMemo(() => {
    const now = Moment()
    return shifts.reduce((acc, x) => {
      const info = getShiftInfo(x, now)
      acc.completed += info.completed
      acc.planned += info.planned
      return acc
    }, { completed: 0, planned: 0 })
  }, [shifts])

  return (
    <div className='pl-time-planner-shift-hours'>

      {totals.completed > 0 && (
        <div className='pl-time-planner-shift-hours__completed'>
          {minutesToFormattedHour(totals.completed)}
        </div>
      )}
      {totals.planned > 0 && (
        <div className='pl-time-planner-shift-hours__planned'>
          {minutesToFormattedHour(totals.planned)}
        </div>
      )}

    </div>
  )
}

ShiftHours.propTypes = {
  shifts: PropTypes.array.isRequired
}

export default ShiftHours
