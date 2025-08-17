'use strict'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import './WidgetPopup.scss'

export default class WidgetPopup extends Component {
  adjustPosition () {
    const node = ReactDOM.findDOMNode(this.refs.popup)
    if (node) {
      const rect = node.getBoundingClientRect()
      const wx = window.innerWidth
      const wy = window.innerHeight

      if (rect.bottom > wy) {
        // Negative value moves popup window up.
        const popupTop = wy - rect.bottom - 20
        node.style.top = popupTop + 'px'
        console.log('Widget top position adjusted:', popupTop)
      }

      if (rect.right > wx) {
        // Negative value moves popup window to the left.
        const popupLeft = wx - rect.right - 20
        node.style.left = popupLeft + 'px'
        console.log('Widget left position adjusted:', popupLeft)
      }
    }
  }

  componentDidMount () {
    this.adjustPosition()
  }

  componentDidUpdate () {
    this.adjustPosition()
  }

  render () {
    const { children, onClose } = this.props
    return (
      <section className='pl-widget-popup' ref='popup'>
        <div className='pl-widget-popup__outside-layer' onClick={onClose} />
        <div className='pl-widget-popup__inside' onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </section>
    )
  }
}

WidgetPopup.propTypes = {
  children: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired
}
