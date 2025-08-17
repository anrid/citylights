'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'

import './ShiftHours.scss'

import { getShiftInfo, minutesToFormattedHour } from './dateUtils'

export default class ShiftHours extends Component {
  render () {
    const { shifts } = this.props
    const now = Moment()
    const totals = shifts.reduce((acc, x) => {
      const info = getShiftInfo(x, now)
      acc.completed += info.completed
      acc.planned += info.planned
      return acc
    }, { completed: 0, planned: 0 })

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
}

ShiftHours.propTypes = {
  shifts: PropTypes.array.isRequired
}
