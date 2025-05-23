'use strict'

import React, { Component } from 'react'
// import { Motion, spring } from 'react-motion' // Removed react-motion
import { motion } from 'framer-motion' // Added framer-motion

import './PopupBox.scss'

// const springModel = { // No longer needed in this format for framer-motion
//   stiffness: 100,
//   damping: 3
// }

export default class PopupBox extends Component {
  render () {
    return (
      // <Motion
      //   defaultStyle={{ scale: 0.8, fade: 0 }}
      //   style={{ scale: spring(1, springModel), fade: spring(1) }}
      // >
      //   {({ scale, fade }) => (
      //     <div
      //       className='pl-popup-box'
      //       style={{
      //         transform: `scale(${scale},${scale})`,
      //         opacity: fade
      //       }}
      //     >
      //       {this.props.children}
      //     </div>
      //   )}
      // </Motion>
      <motion.div
        className='pl-popup-box'
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 3 }}
        // No need for inline styles for transform and opacity here,
        // framer-motion handles applying these from the animate prop.
      >
        {this.props.children}
      </motion.div>
    )
  }
}
