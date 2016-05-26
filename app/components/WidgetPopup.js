'use strict'

import React, { Component } from 'react'

import './WidgetPopup.scss'

export default class WidgetPopup extends Component {
  render () {
    const { children, onClose } = this.props
    return (
      <section className='pl-widget-popup'>
        <div className='pl-widget-popup__outside-layer' onClick={onClose} />
        <div className='pl-widget-popup__inside' onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </section>
    )
  }
}

WidgetPopup.propTypes = {
  children: React.PropTypes.any.isRequired,
  onClose: React.PropTypes.func.isRequired
}
