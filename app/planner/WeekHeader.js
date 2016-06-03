'use strict'

import React, { Component } from 'react'
import Radium from 'radium'
import Moment from 'moment'

import colors from '../styles/colors'

class WeekHeader extends Component {
  static propTypes = {
    pivotDate: React.PropTypes.any.isRequired,
    active: React.PropTypes.bool
  };

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
      <div style={styles.base}>
        {range.active && <div style={styles.activeBar} />}
        <div style={styles.weekOfYear}>{date.week()}</div>
        <div style={[styles.title, range.active && styles.active]}>
          {range.title}
        </div>
        <div style={styles.days}>
          {range.days.map((x, i) => (
            <div key={i} style={[
              styles.day,
              (i === range.days.length - 1) && styles.lastDay,
              range.active && range.today === x && styles.today
            ]}>
              {x}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const styles = {
  base: {
    background: 'transparent',
    color: $c-gray50,
    width: '250px',
    cursor: 'pointer',
    position: 'relative'
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '30px',
    color: $c-gray400,
    fontSize: '1.1rem',
    borderRight: '1px solid '$c-gray200
  },
  active: {
    color: $c-gray600,
    fontWeight: 600
  },
  activeBar: {
    position: 'absolute',
    height: '2px',
    width: '100%',
    backgroundColor: $c-teal500,
    top: 0,
    left: 0,
    zIndex: 2
  },
  weekOfYear: {
    position: 'absolute',
    width: '24px',
    height: '20px',
    borderRadius: '0 0 3px 0',
    backgroundColor: $c-gray50,
    color: $c-gray400,
    top: 0,
    left: 0,
    fontSize: '0.95rem',
    paddingTop: '2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  days: {
    display: 'flex'
  },
  day: {
    flex: 'none',
    width: '50px',
    height: '20px',
    borderRight: '1px solid '$c-gray100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: $c-gray400,
    fontSize: '1rem',
    position: 'relative'
  },
  lastDay: {
    borderRight: '1px solid '$c-gray200
  },
  today: {
    borderTop: '2px solid '$c-teal500,
    fontWeight: 600,
    color: $c-teal500,
    backgroundColor: $c-teal50
  }
}

export default Radium(WeekHeader)
