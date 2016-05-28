'use strict'

import React, { Component } from 'react'
import Moment from 'moment'

import './PlanningShift.scss'

export default class PlanningShift extends Component {

  render () {
    const {
      shift,
      users,
      pivotDate,
      dayWidth,
      onClick,
      position
    } = this.props

    const start = Moment(shift.startDate)
    const end = Moment(shift.endDate)
    const pivot = Moment(pivotDate)

    let daysFromPivot = start.diff(pivot, 'days')
    if (daysFromPivot < 0) {
      // TODO: Handle start dates before pivot date.
      daysFromPivot = 0
    }

    let shiftDays = end.diff(start, 'days')
    if (shiftDays < 0) {
      // TODO: Handle end dates before start date.
      shiftDays = 0
    }

    const style = {
      width: dayWidth + (dayWidth * shiftDays),
      left: dayWidth * daysFromPivot
    }
    // const barsHeight = { height: 52 + position * 32 }

    let cls = ''
    switch (shift.color) {
      case 2:
        cls += 'pl-planning-shift--red'
        break
      case 3:
        cls += 'pl-planning-shift--green'
        break
      case 4:
        cls += 'pl-planning-shift--blue'
        break
    }

    let assignees = null
    if (shift.assignees.length) {
      assignees = (
        <div className='pl-planning-shift__assignees'>
          {' — ' + shift.assignees.map((x) => users[x].firstName).join(', ')}
        </div>
      )
    }
    // <span>[{start.format('HH:mm')}]{' '}</span>

    return (
      <div className={'pl-planning-shift ' + cls} style={style} onClick={onClick}>
        <div className='pl-planning-shift__inner' />
        <div className='pl-planning-shift__title'>
          <span>{shift.title}</span>
        </div>
        {assignees}
      </div>
    )
  }
}

PlanningShift.propTypes = {
  shift: React.PropTypes.object.isRequired,
  users: React.PropTypes.object.isRequired,
  dayWidth: React.PropTypes.number.isRequired,
  position: React.PropTypes.number.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  onClick: React.PropTypes.func.isRequired
}
