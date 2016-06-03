'use strict'

import React, { Component } from 'react'
import Moment from 'moment'
import classnames from 'classnames'

import './WeekHeader.scss'

export default class WeekHeader extends Component {
  getDateRange (date) {
    const start = date.clone().startOf('isoWeek')
    const end = date.clone().endOf('isoWeek')
    let fromFormat = 'D MMM'
    const toFormat = fromFormat
    if (start.month() === end.month()) {
      fromFormat = 'D'
    }
    return {
      days: [
        start.date(),
        start.clone().add(1, 'day').date(),
        start.clone().add(2, 'day').date(),
        start.clone().add(3, 'day').date(),
        start.clone().add(4, 'day').date()
      ],
      title: `${start.format(fromFormat)} — ${end.format(toFormat)}`,
      active: Moment().isBetween(start, end),
      today: Moment().date()
    }
  }

  render () {
    const date = Moment(this.props.pivotDate)
    const range = this.getDateRange(date)

    return (
      <div className='pl-time-planner-week-header'>
        {range.active && <div className='pl-time-planner-week-header__active-bar' />}
        <div className='pl-time-planner-week-header__week-of-year'>{date.week()}</div>
        <div className={classnames({
          'pl-time-planner-week-header__title': true,
          'pl-time-planner-week-header__active': range.active
        })}>
          {range.title}
        </div>
        <div className='pl-time-planner-week-header__days'>
          {range.days.map((x, i) => (
            <div key={i} className={classnames({
              'pl-time-planner-week-header__day': true,
              'pl-time-planner-week-header__last-day': (i === range.days.length - 1),
              'pl-time-planner-week-header__today': range.active && range.today === x
            })}>
              {x}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

WeekHeader.propTypes = {
  pivotDate: React.PropTypes.any.isRequired,
  active: React.PropTypes.bool
}
