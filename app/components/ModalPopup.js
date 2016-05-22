'use strict'

import React, { Component } from 'react'

import './ModalPopup.scss'

export default class ModalPopup extends Component {
  render () {
    const { children, onClose } = this.props
    return (
      <section className='pl-modal-popup'>
        <div
          className='pl-modal-popup__outside-layer'
          onClick={onClose}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </section>
    )
  }
}

ModalPopup.propTypes = {
  children: React.PropTypes.any.isRequired,
  onClose: React.PropTypes.func.isRequired
}
