'use strict'

import React, { Component } from 'react'
import classnames from 'classnames'
import Moment from 'moment'

import './DateGrid.scss'

export default class DateGrid extends Component {
  render () {
    const {
      size,
      preview,
      onClickDate,
      fiveDayWeek,
      pivotDate
    } = this.props

    let count = 0
    let dayCount = 0
    let startDate = Moment(pivotDate).startOf('isoWeek')
    const dates = [ ...new Array(size) ].map((x) => {
      ++count
      if (preview) {
        return count
      }
      ++dayCount
      if (fiveDayWeek && dayCount === 5) {
        count += 2
        dayCount = 0
        return startDate.clone().add(count - 3, 'days').format()
      }
      return startDate.clone().add(count - 1, 'days').format()
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
            onClick={() => preview ? null : onClickDate(x)}
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
  fiveDayWeek: React.PropTypes.bool,
  onClickDate: React.PropTypes.func
}
