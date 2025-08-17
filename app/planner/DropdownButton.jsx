'use strict'

import React, { Component } from 'react'

import './DropdownButton.scss'

export default class DropdownButton extends Component {
  render () {
    const { selected, items, action } = this.props
    return (
      <div className={
        'pl-time-planner-dropdown-button' +
        (action ? ' pl-time-planner-dropdown-button--action-menu' : '')
      }>
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
