'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'

import './PopupBox.scss'

const springModel = {
  stiffness: 100,
  damping: 3
}

function PopupBox({ children }) {
  return (
    <Motion
      defaultStyle={{ scale: 0.8, fade: 0 }}
      style={{ scale: spring(1, springModel), fade: spring(1) }}
    >
      {({ scale, fade }) => (
        <div
          className='pl-popup-box'
          style={{
            transform: `scale(${scale},${scale})`,
            opacity: fade
          }}
        >
          {children}
        </div>
      )}
    </Motion>
  )
}

PopupBox.propTypes = {
  children: PropTypes.any.isRequired
}

export default PopupBox
