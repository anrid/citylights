'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types' // Import PropTypes
import classnames from 'classnames'

import './Button.scss'

export default class Button extends Component {
  render () {
    const { kind, children, onClick } = this.props
    return (
      <div style={{ display: 'inline-block' }}>
        <div
          onClick={onClick || null}
          className={classnames({
            'pl-time-planner-button': true,
            ['pl-time-planner-button--' + (kind || 'default')]: true
          })}
        >
          {children}
        </div>
      </div>
    )
  }
}

Button.propTypes = {
  kind: PropTypes.oneOf(['primary', 'warning']) // Use PropTypes.oneOf
}
