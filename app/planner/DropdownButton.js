'use strict'

import React, { Component } from 'react'

import './DropdownButton.scss'

export default class DropdownButton extends Component {
  render () {
    const { selected, items } = this.props
    return (
      <div className='pl-time-planner-dropdown-button'>
        <div>
          {selected}
          <i className='fa fa-angle-down' />
        </div>
        <div className='pl-time-planner-dropdown-button__menu'>
          {items.map((x, i) => <div key={i}>{x.text}</div>)}
        </div>
      </div>
    )
  }
}
