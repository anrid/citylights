'use strict'

import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './DateGrid.scss'

import { createDatesFromWeekStart } from './dateUtils'

const DateGrid = memo(function DateGrid({
  size,
  preview,
  onClickDate,
  skipWeekends,
  pivotDate
}) {
  // console.log('render DateGrid, ts=', Date.now())
  
  const dates = useMemo(() => createDatesFromWeekStart({
    pivotDate,
    size,
    preview,
    skipWeekends
  }), [pivotDate, size, preview, skipWeekends])

  const cls = useMemo(() => classnames({
    'pl-time-planner-grid-overlay': true,
    'pl-time-planner-grid-overlay--preview': preview
  }), [preview])

  return (
    <section className={cls}>
      {dates.map((x, i) => (
        <div
          key={i}
          className='pl-time-planner-grid-overlay__cell'
          onClick={x ? () => onClickDate(x) : null}
        />
      ))}
    </section>
  )
})

DateGrid.propTypes = {
  size: PropTypes.number.isRequired,
  pivotDate: PropTypes.any.isRequired,
  preview: PropTypes.bool,
  skipWeekends: PropTypes.bool,
  onClickDate: PropTypes.func
}

export default DateGrid
