'use strict'

import React, { Component } from 'react'

import './ShiftProperties.scss'

import Dropdown from './Dropdown'
import ShiftPropertiesForm from './ShiftPropertiesForm'

export default class ShiftProperties extends Component {
  constructor (props) {
    super(props)
    this.onDropdownSelect = this.onDropdownSelect.bind(this)
  }

  onDropdownSelect (command) {
    console.log('TODO: Perform some dropdown action, command=', command)
  }

  renderDropdown () {
    const menuItems = [
      { _id: 1, text: 'Action #1' },
      { _id: 2, text: 'Action #2' }
    ]

    return (
      <Dropdown
        closeOnSelect
        items={menuItems}
        caretOnly
        onSelect={this.onDropdownSelect}
      />
    )
  }

  render () {
    const { shift } = this.props
    return (
      <section className='pl-box pl-shift-properties'>
        <div className='pl-box__header'>
          <div>Shift: {shift.title || 'Untitled'}</div>
          {this.renderDropdown()}
        </div>
        <div className='pl-box__content pl-box__content--with-footer pl-box__content--no-padding'>
          <ShiftPropertiesForm {...this.props} />
        </div>
        <div className='pl-box__footer'>
          <div>Status: Planned.</div>
        </div>
      </section>
    )
  }
}

ShiftProperties.propTypes = {
  shift: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
}
