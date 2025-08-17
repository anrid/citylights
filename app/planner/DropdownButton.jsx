'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import './DropdownButton.scss'

function DropdownButton({ selected, items, action }) {
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

DropdownButton.propTypes = {
  selected: PropTypes.any,
  items: PropTypes.array.isRequired,
  action: PropTypes.bool
}

export default DropdownButton
