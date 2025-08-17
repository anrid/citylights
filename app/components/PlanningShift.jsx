'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Moment from 'moment'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'

import './PlanningShift.scss'

export default class PlanningShift extends Component {
  constructor (props) {
    super(props)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragging = this.onDragging.bind(this)
    this.onDragStop = this.onDragStop.bind(this)
    this.onResizeStart = this.onResizeStart.bind(this)
    this.onResizing = this.onResizing.bind(this)
    this.onResizeStop = this.onResizeStop.bind(this)
    this.state = {
      dateRangeOverlay: null
    }
  }

  onDragStart (e, data) {
    // console.log('onDragStart, data=', data)
  }

  onDragging (e, data) {
    const range = this.calcShiftDateRange(data.x) // Use the current x value
    this.setState({ dateRangeOverlay: range })
  }

  onDragStop (e, data) {
    // console.log('onDragStop, data=', data)
    this.setState({ dateRangeOverlay: null })
    const { shift, updateShiftAction } = this.props
    const range = this.calcShiftDateRange(data.lastX)
    console.log('old date range:', range.start.format(), '-', range.end.format())
    console.log('new date range:', range.newStart.format(), '-', range.newEnd.format())
    updateShiftAction(shift._id, 'startDate', range.newStart.format())
    updateShiftAction(shift._id, 'endDate', range.newEnd.format())
  }

  onResizeStart (e, data) {
    // console.log('onResizeStart, data=', data)
  }

  onResizing (e, data) {
    const { shift } = this.props
    const node = ReactDOM.findDOMNode(this.refs.shiftSize)
    const newEnd = this.calcShiftEndDateAfterResize(node.getBoundingClientRect().width)
    const range = {
      newStart: Moment(shift.startDate),
      newEnd
    }
    this.setState({ dateRangeOverlay: range })
  }

  onResizeStop (e, data) {
    // console.log('onResizeStop, data=', data)
    this.setState({ dateRangeOverlay: null })
    const { updateShiftAction, shift } = this.props
    const node = ReactDOM.findDOMNode(this.refs.shiftSize)
    const newEnd = this.calcShiftEndDateAfterResize(node.getBoundingClientRect().width)
    console.log('old end date:', Moment(shift.endDate).format())
    console.log('new end date:', newEnd.format())
    updateShiftAction(shift._id, 'endDate', newEnd.format())
  }

  calcShiftEndDateAfterResize (shiftWidth) {
    const { shift, dayWidth } = this.props
    let days = Math.floor(shiftWidth / dayWidth)
    if (days < 1) {
      days = 1
    }
    const endDateHours = Moment(shift.endDate).hours()
    return Moment(shift.startDate)
    .add(days - 1, 'days')
    .hours(endDateHours)
  }

  calcShiftDateRange (offsetOnGridX) {
    const { shift, dayWidth } = this.props
    let date = Math.floor(offsetOnGridX / dayWidth)
    if (date < 0) {
      date = 0
    }
    const start = Moment(shift.startDate)
    const end = Moment(shift.endDate)
    const shiftLengthMinutes = end.diff(start, 'minutes')
    const newStart = start.clone()
    .startOf('month')
    .add(date, 'days')
    .add(start.hours(), 'hours')
    .add(start.minutes(), 'minutes')
    const newEnd = newStart.clone().add(shiftLengthMinutes, 'minutes')
    return {
      start,
      end,
      newStart,
      newEnd
    }
  }

  getDateRangeString (from, to) {
    const fromDate = from.format('MMM D')
    const fromTime = from.format('HH:mm')
    const toDate = to.format('MMM D')
    const toTime = to.format('HH:mm')
    if (fromDate === toDate) {
      return `${fromDate} ${fromTime} — ${toTime}`
    }
    return `${fromDate} ${fromTime} — ${toDate} ${toTime}`
  }

  render () {
    const {
      shift,
      users,
      pivotDate,
      dayWidth,
      onClick
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

    const offsetOnGridX = dayWidth * daysFromPivot
    const style = {
      width: dayWidth + (dayWidth * shiftDays)
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

    let assignee = null
    if (shift.assignee) {
      assignee = (
        <div className='pl-planning-shift__assignees'>
          {' — ' + users[shift.assignee].firstName}
        </div>
      )
    }

    let dateRange = null
    const { dateRangeOverlay } = this.state
    if (dateRangeOverlay) {
      dateRange = (
        <span className='pl-planning-shift__date-range-active'>
          {this.getDateRangeString(dateRangeOverlay.newStart, dateRangeOverlay.newEnd)}
        </span>
      )
    } else {
      dateRange = (
        <span className='pl-planning-shift__date-range'>
          {this.getDateRangeString(start, end)}
        </span>
      )
    }

    return (
      <Draggable
        axis='x'
        grid={[dayWidth, dayWidth]}
        onStart={this.onDragStart}
        onDrag={this.onDragging}
        onStop={this.onDragStop}
        cancel='.react-resizable-handle'
        position={{ x: offsetOnGridX, y: 0 }}
      >
        <div className={'pl-planning-shift ' + cls} style={style}>
          <ResizableBox
            onResizeStart={this.onResizeStart}
            onResizeStop={this.onResizeStop}
            onResize={this.onResizing}
            width={style.width} height={dayWidth}
            minConstraints={[dayWidth, dayWidth]} maxConstraints={[1000, dayWidth]}
            draggableOpts={{ axis: 'x', grid: [dayWidth, dayWidth] }}
          >
            <div className='pl-planning-shift__inner' ref='shiftSize' />
          </ResizableBox>
          <div className='pl-planning-shift__title-box'>
            <span className='pl-planning-shift__title' onClick={onClick}>
              {shift.title}
            </span>
            {dateRange}
          </div>
          {assignee}
        </div>
      </Draggable>
    )
  }
}

PlanningShift.propTypes = {
  shift: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  dayWidth: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  pivotDate: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  updateShiftAction: PropTypes.func.isRequired
}
