'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'

import './PlanningShift.scss'

export default class PlanningShift extends Component {
  constructor (props) {
    super(props)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragStop = this.onDragStop.bind(this)
    this.onResizeStart = this.onResizeStart.bind(this)
    this.onResizeStop = this.onResizeStop.bind(this)
  }

  onDragStart (e, data) {
    // console.log('onDragStart, data=', data)
  }

  onDragStop (e, data) {
    console.log('onDragStop, data=', data)
    const { shift, dayWidth, updateShiftAction } = this.props

    let days = Math.floor(data.lastX / dayWidth)
    if (days !== 0) {
      const newStartDate = Moment(shift.startDate).add(days, 'days')
      const newEndDate = Moment(shift.endDate).add(days, 'days')
      console.log('days:', days)
      console.log('old date range:', Moment(shift.startDate).format(), '-', Moment(shift.endDate).format())
      console.log('new date range:', newStartDate.format(), '-', newEndDate.format())
      updateShiftAction(shift._id, 'startDate', newStartDate.format())
      updateShiftAction(shift._id, 'endDate', newEndDate.format())
    }
  }

  onResizeStart (e, data) {
    // console.log('onResizeStart, data=', data)
  }

  onResizeStop (e, data) {
    // console.log('onResizeStop, data=', data)
    const { shift, dayWidth, updateShiftAction } = this.props
    const node = ReactDOM.findDOMNode(this.refs.shiftSize)
    let days = Math.floor(node.getBoundingClientRect().width / dayWidth)
    if (days < 1) {
      days = 1
    }
    const endDateHours = Moment(shift.endDate).hours()
    const newEndDate = Moment(shift.startDate)
    .add(days - 1, 'days')
    .hours(endDateHours)
    console.log('days:', days)
    console.log('old end date:', Moment(shift.endDate).format())
    console.log('new end date:', newEndDate.format())
    updateShiftAction(shift._id, 'endDate', newEndDate.format())
  }

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
      <Draggable
        axis='x'
        grid={[dayWidth, dayWidth]}
        onStart={this.onDragStart}
        onStop={this.onDragStop}
        cancel='.react-resizable-handle'
      >
        <div className={'pl-planning-shift ' + cls} style={style}>
          <ResizableBox
            onResizeStart={this.onResizeStart}
            onResizeStop={this.onResizeStop}
            width={style.width} height={dayWidth}
            minConstraints={[dayWidth, dayWidth]} maxConstraints={[1000, dayWidth]}
            draggableOpts={{ axis: 'x', grid: [dayWidth, dayWidth] }}
          >
            <div className='pl-planning-shift__inner' ref='shiftSize' />
          </ResizableBox>
          <div className='pl-planning-shift__title' onClick={onClick}>
            <span>{shift.title}</span>
          </div>
          {assignees}
        </div>
      </Draggable>
    )
  }
}

PlanningShift.propTypes = {
  shift: React.PropTypes.object.isRequired,
  users: React.PropTypes.object.isRequired,
  dayWidth: React.PropTypes.number.isRequired,
  position: React.PropTypes.number.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  onClick: React.PropTypes.func.isRequired,
  updateShiftAction: React.PropTypes.func.isRequired
}
