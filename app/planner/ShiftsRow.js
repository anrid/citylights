'use strict'

import React, { Component } from 'react'
import Moment from 'moment'

import './ShiftsRow.scss'

import GridOverlay from './GridOverlay'
import TimeItem from './TimeItem'

export default class ShiftsRow extends Component {
  render () {
    const { shifts, actions, pivotDate } = this.props
    const startDate = Moment(pivotDate).startOf('isoWeek')
    return (
      <section className='pl-time-planner-shifts-row'>
        <GridOverlay size={90} />
        {shifts.map((x) => (
          <TimeItem
            key={x._id}
            shift={x}
            width={50}
            pivotDate={startDate}
            onClick={() => actions.showShiftProperties(x._id)}
            updateShiftAction={actions.updateShift}
            unit='days'
            sevenDayWeek
          />
        ))}
      </section>
    )
  }
}

ShiftsRow.propTypes = {
  shifts: React.PropTypes.array.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  actions: React.PropTypes.object.isRequired
}
