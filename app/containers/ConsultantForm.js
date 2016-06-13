'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Moment from 'moment'

import { request } from '../lib/apiClient'
import * as settingsActions from '../actions/settingsActions'
import * as names from '../reducers/generators/names'

import './ConsultantForm.scss'

import SpinnerButton from './SpinnerButton'
import Button from '../planner/Button'

class ConsultantForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      consultant: {
        email: '',
        firstName: '',
        lastName: '',
        phoneWork: '',
        title: '',
        photo: null
      },
      errors: null
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.onSaveConsultantForm = this.onSaveConsultantForm.bind(this)
    this.onReturn = this.onReturn.bind(this)
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
    const { workspaceId } = this.props
    const data = {
      ...this.state.consultant,
      workspaceId
    }

    // Reset form errors on submit.
    // this.setState({ errors: null })

    request('user:invite', data)
    .then(this.onReturn)
    .catch((reason) => {
      if (reason.info && reason.info.error) {
        this.setState({ errors: reason.info.error.details })
      }
    })
  }

  onReturn () {
    const { dispatch } = this.props
    dispatch(settingsActions.routeTo('/consultants'))
  }

  hasError (name) {
    const { errors } = this.state
    return errors && errors[name]
  }

  renderError (name) {
    const { errors } = this.state
    if (!errors || !errors[name]) {
      return null
    }
    return (
      <div className='pl-form__error-text'>
        {errors[name]}
      </div>
    )
  }

  renderUserGenerator () {
    const generate = () => (
      this.setState({
        consultant: names.generateTestConsultantFormData(this.props.userId)
      })
    )

    return (
      <div className='pl-form__row'>
        <div className='pl-form__section-label'></div>
        <div className='pl-form__input'>
          <Button onClick={generate}>
            Fill Form using Test Data
          </Button>
          <div className='pl-form__help-text'>
            This will generate a <b>fake</b> test consultant.<br/>
            <b>Only you</b> will have access to their account, including any emails or reports sent to them.
          </div>
        </div>
      </div>
    )
  }

  renderBasicInfoSection () {
    const { consultant } = this.state
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('email') ? '--error' : '')}>
          <div className='pl-form__section-label'>Basic information</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Email</div>
            <input type='email'
              placeholder='e.g. ace@base.se'
              value={consultant.email}
              onChange={this.onValueChange('email')}
            />
            {this.renderError('email')}
          </div>
        </div>
        <div className={'pl-form__row' + (this.hasError('firstName') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>First name</div>
            <input type='text'
              value={consultant.firstName}
              onChange={this.onValueChange('firstName')}
            />
            {this.renderError('firstName')}
          </div>
        </div>
        <div className={'pl-form__row' + (this.hasError('lastName') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Last name</div>
            <input type='text'
              value={consultant.lastName}
              onChange={this.onValueChange('lastName')}
            />
            {this.renderError('lastName')}
          </div>
        </div>
      </div>
    )
  }

  renderWorkProfileSection () {
    const { consultant } = this.state
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('phoneWork') ? '--error' : '')}>
          <div className='pl-form__section-label'>Work Profile</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Phone Number (Work)</div>
            <input type='text'
              placeholder='e.g +46 18 469548'
              value={consultant.phoneWork}
              onChange={this.onValueChange('phoneWork')}
            />
            {this.renderError('phoneWork')}
            <div className='pl-form__help-text'>
              Primary contact number for work related matters.
            </div>
          </div>
        </div>
        <div className={'pl-form__row' + (this.hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label' />
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              placeholder='e.g Project Manager'
              value={consultant.title}
              onChange={this.onValueChange('title')}
            />
            {this.renderError('title')}
            <div className='pl-form__help-text'>
              The consultants title or role.
            </div>
          </div>
        </div>
        {this.renderUserGenerator()}
      </div>
    )
  }

  render () {
    return (
      <section className='pl-form pl-consultant-form'>
        <div className='pl-form__header'>
          <div>Register a new Consultant</div>
        </div>

        <div className='pl-form__content'>
          {this.renderBasicInfoSection()}
          {this.renderWorkProfileSection()}
        </div>

        <div className='pl-form__footer'>
          <button
            className='pl-cancel-button'
            onClick={this.onReturn}
          >
            Back
          </button>
          <SpinnerButton onClick={this.onSaveConsultantForm}>
            Create
          </SpinnerButton>
        </div>
      </section>
    )
  }
}

function mapStateToProps (state) {
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  const { userId } = state.settings.identity
  return {
    workspaceId,
    userId
  }
}

const ConnectedConsultantForm = connect(mapStateToProps, null)(ConsultantForm)

export default ConnectedConsultantForm
