'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
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

class Loader extends Component {
  render () {
    const {
      isAppLoaded,
      page
    } = this.props

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
}

Loader.propTypes = {
  page: React.PropTypes.any.isRequired
}

function mapStateToProps (state, props) {
  console.log('Loader: props=', props, props.location)
  return {
    isAppLoaded: state.settings.isAppLoaded
  }
}

export default connect(mapStateToProps, null)(Loader)
