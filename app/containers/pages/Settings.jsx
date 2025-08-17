'use strict'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import './Settings.scss'

import * as settingsActions from '../../actions/settingsActions'
import * as workspaceActions from '../../actions/workspaceActions'

import BasicLayout from '../BasicLayout'
import Loader from '../Loader'
import SpinnerButton from '../SpinnerButton.jsx'

function Settings() {
  const dispatch = useDispatch()
  
  // Redux state
  const workspaceId = useSelector(state => state.settings.saved.workspaceId)
  const workspace = useSelector(state => state.workspaces.data[workspaceId])
  
  // Local state
  const [workspaceName, setWorkspaceName] = useState(workspace?.name || '')
  const [workspaceDomain, setWorkspaceDomain] = useState(workspace?.domain || '')
  
  // Action handlers
  const updateWorkspace = (updates) => dispatch(workspaceActions.updateWorkspace(updates))
  
  const onSaveWorkspaceSettings = () => {
    const updates = {
      name: workspaceName,
      domain: workspaceDomain
    }
    updateWorkspace(updates)
  }

  if (!workspace) {
    return <div>Loading workspace...</div>
  }

  return (
    <BasicLayout className='pl-settings'>
      <section className='pl-form'>
        <div className='pl-form__header'>
          <div>Settings</div>
        </div>
        <div className='pl-form__content'>

          <div className='pl-form__row'>
            <div className='pl-form__section-label'>Team Settings</div>
            <div className='pl-form__input'>
              <div className='pl-form__label'>Team Name</div>
              <input type='text'
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <div className='pl-form__help-text'>
                The Team's name could be a company name, a department etc.
              </div>
            </div>
          </div>

          <div className='pl-form__row'>
            <div className='pl-form__section-label'>{' '}</div>
            <div className='pl-form__input'>
              <div className='pl-form__label'>Team Domain</div>
              <input type='text'
                value={workspaceDomain}
                placeholder='e.g. rocksteady.com'
                onChange={(e) => setWorkspaceDomain(e.target.value)}
              />
              <div className='pl-form__help-text'>
                The email domain of the team. Anyone with a matching email address
                can join the team automatically.
              </div>
            </div>
          </div>
        </div>

        <div className='pl-form__footer'>
          <SpinnerButton onClick={onSaveWorkspaceSettings}>
            Save
          </SpinnerButton>
        </div>
      </section>
    </BasicLayout>
  )
}

const SettingsPage = () => (
  <Loader page={Settings} />
)

export default SettingsPage
