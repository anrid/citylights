'use strict'

import React, { Component } from 'react'
import Radium from 'radium'

import colors from '../styles/colors'

class GridOverlay extends Component {
  static propTypes = {
    size: React.PropTypes.number.isRequired
  };

  render () {
    const cells = [ ...new Array(this.props.size) ].map((x, i) => i + 1)
    // console.log('cells=', cells)
    return (
      <section style={styles.base}>
        {cells.map((x) => <div key={x} style={styles.cell} />)}
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
    borderBottom: '1px solid '$c-gray200
  },
  cell: {
    flex: 'none',
    alignItems: 'center',
    height: '50px',
    width: '50px',
    borderRight: '1px solid '$c-gray100,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: $c-gray50
    }
  }
}

export default Radium(GridOverlay)
