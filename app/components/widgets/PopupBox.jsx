'use strict'

import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'

import './PopupBox.scss'

const springModel = {
  stiffness: 100,
  damping: 3
}

export default class PopupBox extends Component {
  render () {
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
            {this.props.children}
          </div>
        )}
      </Motion>
    )
  }
}
