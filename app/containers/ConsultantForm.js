'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { request } from '../lib/apiClient'
import * as settingsActions from '../actions/settingsActions'

import SpinnerButton from './SpinnerButton'

class ConsultantForm extends Component {
  constructor (props) {
    super(props)
    const { consultant } = this.props
    this.state = {
      consultant,
      error: null
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.onSaveConsultantForm = this.onSaveConsultantForm.bind(this)
  }

  onValueChange (fieldName) {
    return (event) => {
      const consultant = Object.assign(
        this.state.consultant,
        { [fieldName]: event.target.value }
      )
      this.setState({ consultant })
    }
  }

  onSaveConsultantForm () {
    const { workspaceId, dispatch } = this.props
    const data = {
      ...this.state,
      workspaceId
    }

    // Reset form errors on submit.
    this.setState({ error: null })

    request('user:invite', data)
    .then(() => {
      console.log('INVITE SUCCESS: ROUTE SOMEWHERE!')
      dispatch(settingsActions.routeTo('/consultants'))
    })
    .catch((error) => {
      if (error.info) {
        console.log('INVITE FAILED: SHOW ERROR MESSAGE, error=', error.info)
      }
    })
  }

  render () {
    const { consultant } = this.props
    return (
      <section className='pl-form'>
        <div className='pl-form__header'>
          <div>Register a new Consultant</div>
        </div>
        <div className='pl-form__content'>

          <div className='pl-form__row'>
            <div className='pl-form__section-label'>Basic information</div>
            <div className='pl-form__input'>
              <div className='pl-form__label'>Email</div>
              <input type='email'
                placeholder='e.g. ace@base.se'
                defaultValue={consultant.email}
                onChange={this.onValueChange('email')}
              />
            </div>
          </div>

          <div className='pl-form__row'>
            <div className='pl-form__section-label'/>
            <div className='pl-form__input'>
              <div className='pl-form__label'>First name</div>
              <input type='text'
                defaultValue={consultant.firstName}
                onChange={this.onValueChange('firstName')}
              />
            </div>
          </div>

          <div className='pl-form__row'>
            <div className='pl-form__section-label'/>
            <div className='pl-form__input'>
              <div className='pl-form__label'>Last name</div>
              <input type='text'
                defaultValue={consultant.lastName}
                onChange={this.onValueChange('lastName')}
              />
            </div>
          </div>

          <div className='pl-form__row'>
            <div className='pl-form__section-label' />
            <div className='pl-form__input'>
              <div className='pl-form__label'>Phone Number (Work)</div>
              <input type='text'
                placeholder='e.g +46 18 469548'
                defaultValue={consultant.phoneWork}
                onChange={this.onValueChange('phoneWork')}
              />
              <div className='pl-form__help-text'>
                The primary contact number for work related matters.
              </div>
            </div>
          </div>

        </div>

        <div className='pl-form__footer'>
          <SpinnerButton onClick={this.onSaveConsultantForm}>
            Create
          </SpinnerButton>
        </div>
      </section>
    )
  }
}

ConsultantForm.propTypes = {
  consultant: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  return {
    workspaceId,
    consultant: { } // state.consultants.data[consultantId]
  }
}

const ConnectedConsultantForm = connect(mapStateToProps, null)(ConsultantForm)

export default ConnectedConsultantForm
