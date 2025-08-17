'use strict'

import React, { useState, useCallback, useRef, memo } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import Draggable from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import classnames from 'classnames'

import './TimeItem.scss'

import {
  getDiff,
  getDateRangeString,
  getDateAsOffsetFromDate
} from './dateUtils'

const TimeItem = memo(function TimeItem({
  shift,
  pivotDate,
  width,
  onClick,
  updateShiftAction,
  skipWeekends,
  unit
}) {
  const [dateRangeOverlay, setDateRangeOverlay] = useState(null)
  const shiftSizeRef = useRef(null)

  const calcShiftEndDate = useCallback((startDate, shiftWidth) => {
    let units = Math.floor(shiftWidth / width)
    if (units < 1) {
      units = 1
    }
    return getDateAsOffsetFromDate(startDate, units - 1, unit, skipWeekends)
  }, [width, unit, skipWeekends])

  const calcShiftDateRange = useCallback((offsetOnGridX, shiftWidth) => {
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

    const newEnd = calcShiftEndDate(newStart, shiftWidth)
    newEnd.hours(end.hours())
    newEnd.minutes(end.minutes())

    return {
      start,
      end,
      newStart,
      newEnd
    }
  }, [shift, pivotDate, width, unit, skipWeekends, calcShiftEndDate])

  const onDragStart = useCallback((e, data) => {
    // console.log('onDragStart, data=', data)
  }, [])

  const onDragging = useCallback((e, data) => {
    const range = calcShiftDateRange(data.x) // Use the current x value
    setDateRangeOverlay(range)
  }, [calcShiftDateRange])

  const onDragStop = useCallback((e, data) => {
    // console.log('onDragStop, data=', data)

    setDateRangeOverlay(null)

    const node = shiftSizeRef.current
    const shiftWidth = node.getBoundingClientRect().width
    const range = calcShiftDateRange(data.lastX, shiftWidth)

    console.log('old date range:', range.start.format(), '-', range.end.format())
    console.log('new date range:', range.newStart.format(), '-', range.newEnd.format())
    updateShiftAction(shift._id, 'startDate', range.newStart.format())
    updateShiftAction(shift._id, 'endDate', range.newEnd.format())
  }, [shift, updateShiftAction, calcShiftDateRange])

  const onResizeStart = useCallback((e, data) => {
    // console.log('onResizeStart, data=', data)
  }, [])

  const onResizing = useCallback((e, data) => {
    const node = shiftSizeRef.current
    const shiftWidth = node.getBoundingClientRect().width
    const newEnd = calcShiftEndDate(shift.startDate, shiftWidth)
    const range = {
      newStart: Moment(shift.startDate),
      newEnd
    }

    setDateRangeOverlay(range)
  }, [shift, calcShiftEndDate])

  const onResizeStop = useCallback((e, data) => {
    // console.log('onResizeStop, data=', data)
    setDateRangeOverlay(null)

    const node = shiftSizeRef.current
    const shiftWidth = node.getBoundingClientRect().width
    const oldEnd = Moment(shift.endDate)
    const newEnd = calcShiftEndDate(shift.startDate, shiftWidth)
    newEnd.hours(oldEnd.hours())
    newEnd.minutes(oldEnd.minutes())

    console.log('old end date:', Moment(shift.endDate).format())
    console.log('new end date:', newEnd.format())
    updateShiftAction(shift._id, 'endDate', newEnd.format())
  }, [shift, updateShiftAction, calcShiftEndDate])

  const renderDateRange = useCallback(() => {
    if (dateRangeOverlay) {
      return (
        <div className='pl-time-planner-time-item__date-range-active'>
          {getDateRangeString(dateRangeOverlay.newStart, dateRangeOverlay.newEnd)}
        </div>
      )
    }
    return (
      <div className='pl-time-planner-time-item__date-range'>
        {getDateRangeString(shift.startDate, shift.endDate)}
      </div>
    )
  }, [shift, dateRangeOverlay])

  // console.log('Rendering time item, shift=', shift._id)

  const start = shift.startDate
  const end = shift.endDate
  const pivot = Moment(pivotDate).startOf('isoWeek')

  if (Moment(start).isBefore(pivot)) {
    // Do not render shifts that start before the pivot date.
    // TODO: handle this properly later !
    return null
  }

  const unitsFromPivot = getDiff(pivot, start, unit, skipWeekends)
  let shiftUnits = getDiff(start, end, unit, skipWeekends)
  if (shiftUnits < 0) {
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
      onStart={onDragStart}
      onDrag={onDragging}
      onStop={onDragStop}
      cancel='.react-resizable-handle'
      position={{ x: offsetOnGridX, y: 0 }}
    >
      <div className={cls} style={style} onDoubleClick={onClick}>
        <ResizableBox
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
          onResize={onResizing}
          width={style.width} height={width}
          minConstraints={[width, width]} maxConstraints={[2000, width]}
          draggableOpts={{ axis: 'x', grid: [width, width] }}
        >
          <div className='pl-time-planner-time-item__inner' ref={shiftSizeRef}>
            <div className='pl-time-planner-time-item__title-box'>
              {renderDateRange()}
            </div>
          </div>
        </ResizableBox>
        <div className='pl-time-planner-time-item__drag-handle' onClick={(e) => e.stopPropagation()}></div>
      </div>
    </Draggable>
  )
})

TimeItem.propTypes = {
  shift: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  pivotDate: PropTypes.any.isRequired,
  onClick: PropTypes.func.isRequired,
  updateShiftAction: PropTypes.func.isRequired,
  skipWeekends: PropTypes.bool,
  unit: PropTypes.string.isRequired
}

export default TimeItem
