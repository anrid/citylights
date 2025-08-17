'use strict'

import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import './PropertiesPanel.scss'

import * as settingsActions from '../actions/settingsActions'
import * as projectActions from '../actions/projectActions'
import * as shiftActions from '../actions/shiftActions'
import * as userActions from '../actions/userActions'

import { getRoute } from '../selectors/routing'

import ModalPopup from '../components/widgets/ModalPopup'

import ConsultantProperties from '../components/properties/ConsultantProperties'
import ShiftProperties from '../components/properties/ShiftProperties'
import ProjectProperties from '../components/properties/ProjectProperties'

function PropertiesPanel() {
  const dispatch = useDispatch()
  
  // Get panel state from Redux
  const settings = useSelector(state => state.settings)
  const propertiesPanelData = useSelector(state => state.settings.propertiesPanelData)
  
  // Create actions object
  const actions = {
    ...Object.keys(settingsActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(settingsActions[key](...args))
      return acc
    }, {}),
    ...Object.keys(projectActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(projectActions[key](...args))
      return acc
    }, {}),
    ...Object.keys(shiftActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(shiftActions[key](...args))
      return acc
    }, {}),
    ...Object.keys(userActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(userActions[key](...args))
      return acc
    }, {})
  }
  
  // Determine panel type and data
  const state = useSelector(state => state)
  let panelType = null
  let panelData = null
  const data = propertiesPanelData
  
  if (data && data.type) {
    panelType = data.type
    switch (panelType) {
      case 'consultant':
        panelData = state.users.data[data.userId]
        break
      case 'project':
        panelData = state.projects.data[data.projectId]
        break
      case 'shift':
        panelData = state.shifts.data[data.shiftId]
        break
      default:
        console.log('Unhandled properties panel data type:', panelType)
    }
  }

  const renderMessage = useCallback((message) => {
    return (
      <div className='pl-modal-popup__message'>
        {message}
      </div>
    )
  }, [])

  const renderContent = useCallback(() => {
    if (!panelData) {
      return renderMessage('Hmm.. that\'s odd. No data was set for this panel.')
    }

    switch (panelType) {
      case 'consultant':
        return <ConsultantProperties consultant={panelData} actions={actions} />
      case 'project':
        return <ProjectProperties project={panelData} actions={actions} />
      case 'shift':
        return <ShiftProperties shift={panelData} actions={actions} />

      default:
        return renderMessage(`Woh.. can't handle the ${panelType} panel type yet.`)
    }
  }, [panelType, panelData, actions, renderMessage])

  if (!settings.isPropertiesPanelOpen) {
    return null
  }

  return (
    <ModalPopup onClose={() => actions.closePropertiesPanel()}>
      {renderContent()}
    </ModalPopup>
  )
}

export default PropertiesPanel
