'use strict'

import React, { Component } from 'react'
import Radium from 'radium'
import Moment from 'moment'

import colors from '../styles/colors'

import WeekHeader from './WeekHeader'

class TimeBar extends Component {
  static propTypes = {
    pivotDate: React.PropTypes.any.isRequired
  };

  render () {
    const week1 = Moment(this.props.pivotDate)
    const weeks = []
    for (let i = 0; i < 9; ++i) {
      weeks.push(week1.clone().add(i, 'week'))
    }

    return (
      <section style={styles.base}>
        <div style={styles.left}>
          <input type='text' style={styles.filterInput}
            placeholder='Search Projects...' />
          <i style={styles.angle} className='fa fa-angle-down' />
        </div>
        <div style={styles.right}>
          {weeks.map((x, i) => <WeekHeader key={i} pivotDate={x} />)}
        </div>
      </section>
    )
  }
}

const styles = {
  base: {
    display: 'flex',
    background: 'white',
    color: $c-gray400,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid '$c-gray300
  },
  angle: {
    flex: 1,
    textAlign: 'right',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: $c-gray300,
    cursor: 'pointer'
  },
  left: {
    flex: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '50px',
    borderRight: '1px solid '$c-gray300,
    width: '324px',
    padding: '0 12px 0 17px'
  },
  right: {
    flex: '10 10',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '50px',
    minWidth: '300px',
    overflow: 'hidden'
  },
  filterInput: {
    padding: 0,
    margin: 0,
    border: 0,
    outline: 'none',
    fontSize: '1.2rem',
    fontWeight: 400,
    width: '250px'
  }
}

export default Radium(TimeBar)
