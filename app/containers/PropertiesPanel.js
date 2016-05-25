'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './PropertiesPanel.scss'

import * as settingsActions from '../actions/settingsActions'
import { getRoute } from '../selectors/routing'

import ModalPopup from '../components/ModalPopup'

import ConsultantProperties from '../components/ConsultantProperties'
import ShiftProperties from '../components/ShiftProperties'

class PropertiesPanel extends Component {
  renderMessage (message) {
    return (
      <div className='pl-modal-popup__message'>
        {message}
      </div>
    )
  }

  renderContent () {
    const {
      panelType,
      panelData,
      isLoadingData,
      actions
    } = this.props

    if (!panelData) {
      return this.renderMessage('Hmm.. that’s odd. No data was set for this panel.')
    }
    if (isLoadingData) {
      return this.renderMessage('Loading ..')
    }

    switch (panelType) {
      case 'consultant':
        return <ConsultantProperties consultant={panelData} actions={actions} />

      case 'shift':
        return <ShiftProperties shift={panelData} actions={actions} />

      default:
        return this.renderMessage(`Woh.. can’t handle the ${panelType} panel type yet.`)
    }
  }

  render () {
    const { settings, actions } = this.props
    if (!settings.isPropertiesPanelOpen) {
      return null
    }

    return (
      <ModalPopup onClose={() => actions.setPropertiesPanelOpen(false)}>
        {this.renderContent()}
      </ModalPopup>
    )
  }
}

function mapStateToProps (state) {
  // console.log('PropertiesPanel, state=', state)
  let panelType = null
  let panelData = null
  const data = state.settings.propertiesPanelData
  if (data && data.type) {
    panelType = data.type
    switch (panelType) {
      case 'consultant':
        panelData = state.users.data[data.userId]
        break
      case 'shift':
        panelData = state.shifts.data[data.shiftId]
        break
      default:
        console.log('Unhandled properties panel data type:', panelType)
    }
  }

  return {
    panelType,
    panelData,
    isLoadingData: false,
    settings: state.settings,
    route: getRoute(state.routing)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

const ConnectedPropertiesPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesPanel)

export default ConnectedPropertiesPanel
