'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './ColorPicker.scss'

const colors = ['gray', 'amber', 'green', 'red', 'teal', 'blue', 'purple', 'brown']

export default class ColorPicker extends Component {
  render () {
    const { onSelect, selected } = this.props
    return (
      <div className='pl-color-picker'>
        {colors.map((color, i) => {
          const cls = classnames({
            'pl-color-picker__dot': true,
            ['pl-color-picker__' + color]: true,
            'pl-color-picker__selected': i === selected
          })
          return <div key={color} className={cls} onClick={() => onSelect(i)} />
        })}
      </div>
    )
  }
}

ColorPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.number
}
