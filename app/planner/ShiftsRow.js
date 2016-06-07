'use strict'

import React, { Component } from 'react'

import './ShiftsRow.scss'

import DateGrid from './DateGrid'
import TimeItem from './TimeItem'

export default class ShiftsRow extends Component {
  renderShifts () {
    const {
      shifts,
      actions,
      pivotDate,
      preview
    } = this.props

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
  }

  render () {
    const { pivotDate, preview, onCreateShift } = this.props
    return (
      <section className='pl-time-planner-shifts-row'>
        <DateGrid
          size={50}
          preview={preview}
          skipWeekends
          pivotDate={pivotDate}
          onClickDate={onCreateShift}
        />
        {this.renderShifts()}
      </section>
    )
  }
}

ShiftsRow.propTypes = {
  shifts: React.PropTypes.array.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  actions: React.PropTypes.object.isRequired,
  onCreateShift: React.PropTypes.func
}
