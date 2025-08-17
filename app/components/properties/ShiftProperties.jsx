'use strict'

import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import './ShiftProperties.scss'

import Dropdown from '../widgets/Dropdown'
import ShiftPropertiesForm from './ShiftPropertiesForm'

function ShiftProperties(props) {
  const { shift } = props

  const onDropdownSelect = useCallback((command) => {
    console.log('TODO: Perform some dropdown action, command=', command)
  }, [])

  const renderDropdown = useCallback(() => {
    const menuItems = [
      { _id: 1, text: 'Action #1' },
      { _id: 2, text: 'Action #2' }
    ]

    return (
      <Dropdown
        closeOnSelect
        items={menuItems}
        caretOnly
        onSelect={onDropdownSelect}
      />
    )
  }, [onDropdownSelect])

  return (
    <section className='pl-box pl-shift-properties'>
      <div className='pl-box__header'>
        <div>Shift: {shift.title || 'Untitled'}</div>
        {renderDropdown()}
      </div>
      <div className='pl-box__content pl-box__content--with-footer pl-box__content--no-padding'>
        <ShiftPropertiesForm {...props} />
      </div>
      <div className='pl-box__footer'>
        <div>Status: Planned.</div>
      </div>
    </section>
  )
}

ShiftProperties.propTypes = {
  shift: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

export default ShiftProperties
