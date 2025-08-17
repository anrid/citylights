'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'

import './TimeBar.scss'

import WeekHeader from './WeekHeader'

export default class TimeBar extends Component {
  render () {
    const { pivotDate, showHours } = this.props
    const week1 = Moment(pivotDate)
    const weeks = []
    for (let i = 0; i < 9; ++i) {
      weeks.push(week1.clone().add(i, 'week'))
    }

    return (
      <section className='pl-time-planner-time-bar'>
        <div className='pl-time-planner-time-bar__left'>
          <input type='text' className='pl-time-planner-time-bar__filter-input'
            placeholder='Search Projects...' />
          <i className='fa fa-angle-down' />
        </div>
        <div className='pl-time-planner-time-bar__right'>
          {showHours && (
            <div className='pl-time-planner-time-bar__hours'>
              Scheduled Hours Total
            </div>
          )}
          {weeks.map((x, i) => <WeekHeader key={i} pivotDate={x} />)}
        </div>
      </section>
    )
  }
}

TimeBar.propTypes = {
  pivotDate: PropTypes.any.isRequired,
  showHours: PropTypes.bool
}
