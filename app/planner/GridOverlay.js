'use strict'

import React, { Component } from 'react'

import './GridOverlay.scss'

export default class GridOverlay extends Component {
  render () {
    const cells = [ ...new Array(this.props.size) ].map((x, i) => i + 1)
    // console.log('cells=', cells)
    return (
      <section className='pl-time-planner-grid-overlay'>
        {cells.map((x) => <div key={x} className='pl-time-planner-grid-overlay__cell' />)}
      </section>
    )
  }
}

GridOverlay.propTypes = {
  size: React.PropTypes.number.isRequired
}
