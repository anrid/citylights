'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import './SpinnerButton.scss'

function SpinnerButton({ onClick, children }) {
  const settings = useSelector(state => state.settings)
  
  const {
    isConnectedToServer,
    isWaitingForServer,
    isRequestInProgress
  } = settings

  const isDisabled = !isConnectedToServer
  const showSpinner = isWaitingForServer || isRequestInProgress
  const cls = 'pl-spinner-button' + (isDisabled ? '--disabled' : '')

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

SpinnerButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default SpinnerButton