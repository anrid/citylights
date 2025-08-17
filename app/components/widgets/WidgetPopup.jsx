'use strict'

import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import './WidgetPopup.scss'

function WidgetPopup({ children, onClose }) {
  const popupRef = useRef(null)

  const adjustPosition = useCallback(() => {
    const node = popupRef.current
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
  }, [])

  useEffect(() => {
    adjustPosition()
  }, [adjustPosition])

  useEffect(() => {
    adjustPosition()
  })

  return (
    <section className='pl-widget-popup' ref={popupRef}>
      <div className='pl-widget-popup__outside-layer' onClick={onClose} />
      <div className='pl-widget-popup__inside' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </section>
  )
}

WidgetPopup.propTypes = {
  children: PropTypes.any.isRequired,
  onClose: PropTypes.func.isRequired
}

export default WidgetPopup
