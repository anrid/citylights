'use strict'

import React, { Component } from 'react'
import Moment from 'moment'

import './ProjectShiftsRow.scss'

import TimeItem from './TimeItem'

export default class ProjectShiftsRow extends Component {
  render () {
    const { shifts, actions, pivotDate } = this.props
    const startDate = Moment(pivotDate).startOf('isoWeek')
    return (
      <section className='pl-time-planner-project-shifts-row'>
        {shifts.map((x) => (
          <TimeItem
            key={x._id}
            shift={x}
            width={50}
            pivotDate={startDate}
            usersMap={this.props.usersMap}
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

ProjectShiftsRow.propTypes = {
  project: React.PropTypes.object.isRequired,
  shifts: React.PropTypes.array.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  actions: React.PropTypes.object.isRequired,
  usersMap: React.PropTypes.object.isRequired
}
