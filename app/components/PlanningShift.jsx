'use strict'

import React, { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'

import './PlanningShift.scss'

function PlanningShift(props) {
  const [dateRangeOverlay, setDateRangeOverlay] = useState(null)
  const shiftSizeRef = useRef(null)

  const onDragStart = useCallback((e, data) => {
    // console.log('onDragStart, data=', data)
  }, [])

  const onDragging = useCallback((e, data) => {
    const range = calcShiftDateRange(data.x) // Use the current x value
    setDateRangeOverlay(range)
  }, [props.shift, props.dayWidth])

  const onDragStop = useCallback((e, data) => {
    // console.log('onDragStop, data=', data)
    setDateRangeOverlay(null)
    const { shift, updateShiftAction } = props
    const range = calcShiftDateRange(data.lastX)
    console.log('old date range:', range.start.format(), '-', range.end.format())
    console.log('new date range:', range.newStart.format(), '-', range.newEnd.format())
    updateShiftAction(shift._id, 'startDate', range.newStart.format())
    updateShiftAction(shift._id, 'endDate', range.newEnd.format())
  }, [props.shift, props.updateShiftAction, props.dayWidth])

  const onResizeStart = useCallback((e, data) => {
    // console.log('onResizeStart, data=', data)
  }, [])

  const onResizing = useCallback((e, data) => {
    const { shift } = props
    const node = shiftSizeRef.current
    const newEnd = calcShiftEndDateAfterResize(node.getBoundingClientRect().width)
    const range = {
      newStart: Moment(shift.startDate),
      newEnd
    }
    setDateRangeOverlay(range)
  }, [props.shift, props.dayWidth])

  const onResizeStop = useCallback((e, data) => {
    // console.log('onResizeStop, data=', data)
    setDateRangeOverlay(null)
    const { updateShiftAction, shift } = props
    const node = shiftSizeRef.current
    const newEnd = calcShiftEndDateAfterResize(node.getBoundingClientRect().width)
    console.log('old end date:', Moment(shift.endDate).format())
    console.log('new end date:', newEnd.format())
    updateShiftAction(shift._id, 'endDate', newEnd.format())
  }, [props.shift, props.updateShiftAction, props.dayWidth])

  const calcShiftEndDateAfterResize = useCallback((shiftWidth) => {
    const { shift, dayWidth } = props
    let days = Math.floor(shiftWidth / dayWidth)
    if (days < 1) {
      days = 1
    }
    const endDateHours = Moment(shift.endDate).hours()
    return Moment(shift.startDate)
    .add(days - 1, 'days')
    .hours(endDateHours)
  }, [props.shift, props.dayWidth])

  const calcShiftDateRange = useCallback((offsetOnGridX) => {
    const { shift, dayWidth } = props
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
  }, [props.shift, props.dayWidth])

  const getDateRangeString = useCallback((from, to) => {
    const fromDate = from.format('MMM D')
    const fromTime = from.format('HH:mm')
    const toDate = to.format('MMM D')
    const toTime = to.format('HH:mm')
    if (fromDate === toDate) {
      return `${fromDate} ${fromTime} — ${toTime}`
    }
    return `${fromDate} ${fromTime} — ${toDate} ${toTime}`
  }, [])

  const {
    shift,
    users,
    pivotDate,
    dayWidth,
    onClick
  } = props

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
  if (dateRangeOverlay) {
    dateRange = (
      <span className='pl-planning-shift__date-range-active'>
        {getDateRangeString(dateRangeOverlay.newStart, dateRangeOverlay.newEnd)}
      </span>
    )
  } else {
    dateRange = (
      <span className='pl-planning-shift__date-range'>
        {getDateRangeString(start, end)}
      </span>
    )
  }

  return (
    <Draggable
      axis='x'
      grid={[dayWidth, dayWidth]}
      onStart={onDragStart}
      onDrag={onDragging}
      onStop={onDragStop}
      cancel='.react-resizable-handle'
      position={{ x: offsetOnGridX, y: 0 }}
    >
      <div className={'pl-planning-shift ' + cls} style={style}>
        <ResizableBox
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          onResize={onResizing}
          width={style.width} height={dayWidth}
          minConstraints={[dayWidth, dayWidth]} maxConstraints={[1000, dayWidth]}
          draggableOpts={{ axis: 'x', grid: [dayWidth, dayWidth] }}
        >
          <div className='pl-planning-shift__inner' ref={shiftSizeRef} />
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

PlanningShift.propTypes = {
  shift: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  dayWidth: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  pivotDate: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  updateShiftAction: PropTypes.func.isRequired
}

export default PlanningShift
