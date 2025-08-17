'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './Button.scss'

function Button({ kind, children, onClick }) {
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

export default Button

Button.propTypes = {
  kind: PropTypes.oneOf(['primary', 'warning'])
}
