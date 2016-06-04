'use strict'

import React, { Component } from 'react'
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
  kind: React.PropTypes.oneOf(['primary', 'warning'])
}
