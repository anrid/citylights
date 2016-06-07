'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import classnames from 'classnames'

import './TimeItem.scss'

import {
  getDiff,
  getDateRangeString,
  getDateAsOffsetFromDate
} from './dateUtils'

export default class TimeItem extends Component {
  constructor (props) {
    super(props)
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
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

    const node = ReactDOM.findDOMNode(this.refs.shiftSize)
    const shiftWidth = node.getBoundingClientRect().width
    const range = this.calcShiftDateRange(data.lastX, shiftWidth)

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
    const shiftWidth = node.getBoundingClientRect().width
    const newEnd = this.calcShiftEndDate(shift.startDate, shiftWidth)
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
    const shiftWidth = node.getBoundingClientRect().width
    const oldEnd = Moment(shift.endDate)
    const newEnd = this.calcShiftEndDate(shift.startDate, shiftWidth)
    newEnd.hours(oldEnd.hours())
    newEnd.minutes(oldEnd.minutes())

    console.log('old end date:', Moment(shift.endDate).format())
    console.log('new end date:', newEnd.format())
    updateShiftAction(shift._id, 'endDate', newEnd.format())
  }

  calcShiftEndDate (startDate, shiftWidth) {
    const { width, unit, skipWeekends } = this.props
    let units = Math.floor(shiftWidth / width)
    if (units < 1) {
      units = 1
    }
    return getDateAsOffsetFromDate(startDate, units - 1, unit, skipWeekends)
  }

  calcShiftDateRange (offsetOnGridX, shiftWidth) {
    const {
      pivotDate,
      shift,
      width,
      unit,
      skipWeekends
    } = this.props

    let units = Math.floor(offsetOnGridX / width)
    if (units < 0) {
      units = 0
    }
    const start = Moment(shift.startDate)
    const end = Moment(shift.endDate)
    const pivot = Moment(pivotDate).startOf('isoWeek')

    const newStart = getDateAsOffsetFromDate(pivot, units, unit, skipWeekends)
    if (unit !== 'hours') {
      newStart.add(start.hours(), 'hours')
    }
    newStart.add(start.minutes(), 'minutes')

    const newEnd = this.calcShiftEndDate(newStart, shiftWidth)
    newEnd.hours(end.hours())
    newEnd.minutes(end.minutes())

    return {
      start,
      end,
      newStart,
      newEnd
    }
  }

  renderDateRange () {
    const { shift } = this.props
    const { dateRangeOverlay } = this.state
    if (dateRangeOverlay) {
      return (
        <span className='pl-time-planner-time-item__date-range-active'>
          {getDateRangeString(dateRangeOverlay.newStart, dateRangeOverlay.newEnd)}
        </span>
      )
    }
    return (
      <span className='pl-time-planner-time-item__date-range'>
        {getDateRangeString(shift.startDate, shift.endDate)}
      </span>
    )
  }

  render () {
    const {
      shift,
      pivotDate,
      width,
      onClick,
      unit,
      skipWeekends
    } = this.props
    // console.log('Rendering time item, shift=', shift._id)

    const start = shift.startDate
    const end = shift.endDate
    const pivot = Moment(pivotDate).startOf('isoWeek')

    let unitsFromPivot = getDiff(pivot, start, unit, skipWeekends)
    if (unitsFromPivot < 0) {
      // TODO: Handle start dates before pivot date.
      unitsFromPivot = 0
    }

    let shiftUnits = getDiff(start, end, unit, skipWeekends)
    if (shiftUnits < 0) {
      // TODO: Handle end dates before start date.
      shiftUnits = 0
    }

    // console.log('Shift: unitsFromPivot=', unitsFromPivot, 'shiftUnits=', shiftUnits)

    const offsetOnGridX = width * unitsFromPivot
    const style = {
      width: width + (width * shiftUnits)
    }

    const colors = ['gray', 'amber', 'green', 'red', 'teal', 'blue', 'purple', 'brown']
    const color = colors[shift.color]
    const cls = classnames({
      ['pl-time-planner-time-item--' + color]: true,
      'pl-time-planner-time-item': true
    })

    return (
      <Draggable
        axis='x'
        handle='.pl-time-planner-time-item__drag-handle'
        grid={[width, width]}
        onStart={this.onDragStart}
        onDrag={this.onDragging}
        onStop={this.onDragStop}
        cancel='.react-resizable-handle'
        position={{ x: offsetOnGridX, y: 0 }}
      >
        <div className={cls} style={style}>
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
          <div className='pl-time-planner-time-item__drag-handle'></div>
          <div className='pl-time-planner-time-item__title-box' onClick={onClick}>
            {this.renderDateRange()}
          </div>
        </div>
      </Draggable>
    )
  }
}

TimeItem.propTypes = {
  shift: React.PropTypes.object.isRequired,
  width: React.PropTypes.number.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  onClick: React.PropTypes.func.isRequired,
  updateShiftAction: React.PropTypes.func.isRequired,
  skipWeekends: React.PropTypes.bool,
  unit: React.PropTypes.string.isRequired
}
