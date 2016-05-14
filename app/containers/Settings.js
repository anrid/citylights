'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Settings.scss'

import * as settingsActions from '../actions/settingsActions'

import BasicLayout from './BasicLayout'

class Settings extends Component {
  render () {
    const { actions } = this.props

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
                  onChange={(x) => this.setState({ workspaceName: x })}
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
                  placeholder='e.g. rocksteady.com'
                  onChange={(x) => this.setState({ workspaceDomain: x })}
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

function mapStateToProps (state) {
  return {
    // TODO: Load workspace activity here.
    settings: state.settings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
