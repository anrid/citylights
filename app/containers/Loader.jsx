'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Motion, spring } from 'react-motion'

const springModel = {
  stiffness: 40,
  damping: 1,
  precision: 0.001
}

const fadeModel = {
  stiffness: 40,
  damping: 20
}

function Loader({ page }) {
  const isAppLoaded = useSelector(state => state.settings.isAppLoaded)

  if (!isAppLoaded) {
    return (
      <div className='pl-loading'>
        <Motion
          defaultStyle={{ scale: 0.8, fade: 0 }}
          style={{ scale: spring(1, springModel), fade: spring(1, fadeModel) }}
        >
          {({ scale, fade }) => (
            <div className='pl-loading__text' style={{
              transform: `scale(${scale},${scale})`,
              opacity: fade
            }}>
              Loading..
            </div>
          )}
        </Motion>
      </div>
    )
  }

  console.log('App is loaded, rendering page.')
  const Page = page

  return <Page />
}

Loader.propTypes = {
  page: PropTypes.any.isRequired
}

export default Loader
