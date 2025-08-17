'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import './ModalPopup.scss'

function ModalPopup({ children, onClose }) {
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

ModalPopup.propTypes = {
  children: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired
}

export default ModalPopup
