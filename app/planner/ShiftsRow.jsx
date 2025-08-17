'use strict'

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import './ShiftsRow.scss'

import DateGrid from './DateGrid'
import TimeItem from './TimeItem'

function ShiftsRow({ shifts, actions, pivotDate, preview, onCreateShift }) {
  const renderShifts = useCallback(() => {
    if (preview) {
      return null
    }

    return shifts.map((x) => (
      <TimeItem
        key={x._id}
        shift={x}
        width={50}
        pivotDate={pivotDate}
        onClick={() => actions.showShiftProperties(x._id)}
        updateShiftAction={actions.updateShift}
        unit='days'
        skipWeekends
      />
    ))
  }, [shifts, actions, pivotDate, preview])

  return (
    <section className='pl-time-planner-shifts-row'>
      <DateGrid
        size={50}
        preview={preview}
        skipWeekends
        pivotDate={pivotDate}
        onClickDate={onCreateShift}
      />
      {renderShifts()}
    </section>
  )
}

ShiftsRow.propTypes = {
  shifts: PropTypes.array.isRequired,
  pivotDate: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired,
  onCreateShift: PropTypes.func,
  preview: PropTypes.bool
}

export default ShiftsRow
