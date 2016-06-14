'use strict'

import React, { Component } from 'react'

import './ConsultantPropertiesForm.scss'

export default class ConsultantPropertiesForm extends Component {
  constructor (props) {
    super(props)

    const c = props.consultant || { }
    this.state = {
      errors: null,
      consultant: {
        email: c.email,
        firstName: c.firstName,
        lastName: c.lastName
      },
      workProfile: {
        title: c.profile.title,
        phoneWork: c.profile.phoneWork
      }
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onSaveWorkProfile = this.onSaveWorkProfile.bind(this)
  }

  onValueChange (section, fieldName) {
    return (event) => {
      const updated = Object.assign(
        this.state[section] || { },
        { [fieldName]: event.target.value }
      )
      this.setState({ [section]: updated })
    }
  }

  onSave () {
    const newInfo = this.state.consultant
    const { consultant, actions } = this.props
    Object.keys(newInfo).forEach((x) => {
      if (consultant[x] !== newInfo[x]) {
        console.log('Saving', x, newInfo[x])
        actions.updateUser(consultant._id, x, newInfo[x])
      }
    })
  }

  onSaveWorkProfile () {
    const { workProfile } = this.state
    const { consultant, actions } = this.props
    Object.keys(workProfile).forEach((x) => {
      if (consultant.profile[x] !== workProfile[x]) {
        console.log('Saving', x, workProfile[x])
        actions.updateWorkProfile(consultant._id, x, workProfile[x])
      }
    })
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

  renderPersonalInformationFormSection () {
    const { consultant } = this.state
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('email') ? '--error' : '')}>
          <div className='pl-form__section-label'>Personal information</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Email</div>
            <input type='text'
              value={consultant.email}
              onChange={this.onValueChange('consultant', 'email')}
              onBlur={this.onSave}
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
              onChange={this.onValueChange('consultant', 'firstName')}
              onBlur={this.onSave}
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
              onChange={this.onValueChange('consultant', 'lastName')}
              onBlur={this.onSave}
            />
          {this.renderError('lastName')}
          </div>
        </div>
      </div>
    )
  }

  renderWorkProfileFormSection () {
    const { workProfile } = this.state
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('firstName') ? '--error' : '')}>
          <div className='pl-form__section-label'>Work Profile</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              placeholder='e.g. Sales Representative'
              value={workProfile.title}
              onChange={this.onValueChange('workProfile', 'title')}
              onBlur={this.onSaveWorkProfile}
            />
            {this.renderError('title')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('phoneWork') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Phone (Work)</div>
            <input type='text'
              placeholder='e.g. +46 18 469548'
              value={workProfile.phoneWork}
              onChange={this.onValueChange('workProfile', 'phoneWork')}
              onBlur={this.onSaveWorkProfile}
            />
          {this.renderError('phoneWork')}
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <section className='pl-consultant-properties-form'>
        {this.renderPersonalInformationFormSection()}
        {this.renderWorkProfileFormSection()}
      </section>
    )
  }
}

ConsultantPropertiesForm.propTypes = {
  consultant: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
}
