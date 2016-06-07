'use strict'

import React, { Component } from 'react'
import classnames from 'classnames'

import './DateGrid.scss'

import { createDatesFromWeekStart } from './dateUtils'

export default class DateGrid extends Component {
  shouldComponentUpdate (newProps) {
    if (newProps.size !== this.props.size) {
      return true
    }
    if (newProps.pivotDate !== this.props.pivotDate) {
      return true
    }
    if (newProps.skipWeekends !== this.props.skipWeekends) {
      return true
    }
    return false
  }

  render () {
    // console.log('render DateGrid, ts=', Date.now())
    const {
      size,
      preview,
      onClickDate,
      skipWeekends,
      pivotDate
    } = this.props

    const dates = createDatesFromWeekStart({
      pivotDate,
      size,
      preview,
      skipWeekends
    })

    const cls = classnames({
      'pl-time-planner-grid-overlay': true,
      'pl-time-planner-grid-overlay--preview': preview
    })

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
  }
}

DateGrid.propTypes = {
  size: React.PropTypes.number.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  preview: React.PropTypes.bool,
  skipWeekends: React.PropTypes.bool,
  onClickDate: React.PropTypes.func
}
