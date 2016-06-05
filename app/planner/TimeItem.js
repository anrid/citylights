'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'

import './TimeItem.scss'

export default class TimeItem extends Component {
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
    // updateShiftAction(shift._id, 'startDate', range.newStart.format())
    // updateShiftAction(shift._id, 'endDate', range.newEnd.format())
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
    // updateShiftAction(shift._id, 'endDate', newEnd.format())
  }

  calcShiftEndDateAfterResize (shiftWidth) {
    const { shift, width, unit } = this.props
    let units = Math.floor(shiftWidth / width)
    if (units < 1) {
      units = 1
    }
    const endDateHours = Moment(shift.endDate).hours()
    return Moment(shift.startDate)
    .add(units - 1, unit)
    .hours(endDateHours)
  }

  calcShiftDateRange (offsetOnGridX) {
    const { shift, width, unit } = this.props
    let units = Math.floor(offsetOnGridX / width)
    if (units < 0) {
      units = 0
    }
    const start = Moment(shift.startDate)
    const end = Moment(shift.endDate)
    const shiftLengthMinutes = end.diff(start, 'minutes')

    const newStart = start.clone()
    .startOf('month')
    .add(units, unit)
    if (unit !== 'hours') {
      newStart.add(start.hours(), 'hours')
    }
    newStart.add(start.minutes(), 'minutes')

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
      usersMap,
      pivotDate,
      width,
      onClick,
      unit
    } = this.props

    const start = Moment(shift.startDate)
    const end = Moment(shift.endDate)
    const pivot = Moment(pivotDate)

    let unitsFromPivot = start.diff(pivot, unit)
    if (unitsFromPivot < 0) {
      // TODO: Handle start dates before pivot date.
      unitsFromPivot = 0
    }

    let shiftUnits = end.diff(start, unit)
    if (shiftUnits < 0) {
      // TODO: Handle end dates before start date.
      shiftUnits = 0
    }

    const offsetOnGridX = width * unitsFromPivot
    const style = {
      width: width + (width * shiftUnits)
    }

    const colors = ['gray', 'amber', 'green', 'red', 'teal', 'blue', 'purple', 'brown']
    const color = colors[shift.color]
    const cls = 'pl-time-planner-time-item--' + color

    let dateRange = null
    const { dateRangeOverlay } = this.state
    if (dateRangeOverlay) {
      dateRange = (
        <span className='pl-time-planner-time-item__date-range-active'>
          {this.getDateRangeString(dateRangeOverlay.newStart, dateRangeOverlay.newEnd)}
        </span>
      )
    } else {
      dateRange = (
        <span className='pl-time-planner-time-item__date-range'>
          {this.getDateRangeString(start, end)}
        </span>
      )
    }

    return (
      <Draggable
        axis='x'
        grid={[width, width]}
        onStart={this.onDragStart}
        onDrag={this.onDragging}
        onStop={this.onDragStop}
        cancel='.react-resizable-handle'
        position={{ x: offsetOnGridX, y: 0 }}
      >
        <div className={'pl-time-planner-time-item ' + cls} style={style}>
          <ResizableBox
            onResizeStart={this.onResizeStart}
            onResizeStop={this.onResizeStop}
            onResize={this.onResizing}
            width={style.width} height={width}
            minConstraints={[width, width]} maxConstraints={[2000, width]}
            draggableOpts={{ axis: 'x', grid: [width, width] }}
          >
            <div className='pl-time-planner-time-item__inner' ref='shiftSize' />
          </ResizableBox>
          <div className='pl-time-planner-time-item__title-box'>
            <span className='pl-time-planner-time-item__title' onClick={onClick}>
              {shift.title}
            </span>
            {dateRange}
          </div>
        </div>
      </Draggable>
    )
  }
}

TimeItem.propTypes = {
  shift: React.PropTypes.object.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number,
  pivotDate: React.PropTypes.any.isRequired,
  onClick: React.PropTypes.func.isRequired,
  updateShiftAction: React.PropTypes.func.isRequired,
  sevenDayWeek: React.PropTypes.bool,
  unit: React.PropTypes.string.isRequired
}
