'use strict'

import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Settings.scss'

import * as settingsActions from '../actions/settingsActions'
import * as workspaceActions from '../actions/workspaceActions'

import BasicLayout from './BasicLayout'
import Loader from './Loader'

class Settings extends Component {
  constructor (props) {
    super(props)
    const { workspace } = this.props
    this.state = {
      workspace: {
        name: workspace.name,
        domain: workspace.domain
      }
    }
  }

  onSaveWorkspaceSettings () {
    const { actions } = this.props
    const updates = {
      name: this.state.workspaceName,
      domain: this.state.workspaceDomain
    }
    actions.updateWorkspace(updates)
  }

  render () {
    const { workspace } = this.props

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
                  defaultValue={workspace.name}
                  onChange={(x) => this.setState({ workspaceName: x.target.value })}
                />
                <div className='pl-form__help-text'>
                  The Team’s name could be a company name, a department etc.
                </div>
              </div>
            </div>

            <div className='pl-form__row'>
              <div className='pl-form__section-label'>{' '}</div>
              <div className='pl-form__input'>
                <div className='pl-form__label'>Team Domain</div>
                <input type='text'
                  defaultValue={workspace.domain}
                  placeholder='e.g. rocksteady.com'
                  onChange={(x) => this.setState({ workspaceDomain: x.target.value })}
                />
                <div className='pl-form__help-text'>
                  The email domain of the team. Anyone with a matching email address
                  can join the team automatically.
                </div>
              </div>
            </div>
          </div>

          <div className='pl-form__footer'>
            <button onClick={() => this.onSaveWorkspaceSettings()}>
              Save
            </button>
          </div>
        </section>
      </BasicLayout>
    )
  }
}

Settings.propTypes = {
  workspace: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  // console.log('=== Settings: state=', state)
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  return {
    workspace: state.workspaces.data[workspaceId]
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions,
      ...workspaceActions
    }, dispatch)
  }
}

const ConnectedSettings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)

const SettingsPage = () => (
  <Loader page={ConnectedSettings} />
)

export default SettingsPage
