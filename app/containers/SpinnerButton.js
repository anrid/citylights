'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'

import './SpinnerButton.scss'

class SpinnerButton extends Component {
  render () {
    const { onClick, children, settings } = this.props
    const {
      isConnectedToServer,
      isWaitingForServer,
      isRequestInProgress
    } = settings

    const isDisabled = !isConnectedToServer
    const showSpinner = isWaitingForServer || isRequestInProgress
    let cls = 'pl-spinner-button' + (isDisabled ? '--disabled' : '')

    return (
      <button
        className={cls}
        onClick={onClick}
        disabled={isDisabled}
      >
        {showSpinner ? <i className='fa fa-fw fa-gear fa-spin'/> : children}
      </button>
    )
  }
}

SpinnerButton.propTypes = {
  onClick: React.PropTypes.func.isRequired
}

function mapStateToProps (state) {
  return {
    settings: state.settings
  }
}

const ConnectedSpinnerButton = connect(mapStateToProps, null)(SpinnerButton)

export default ConnectedSpinnerButton
