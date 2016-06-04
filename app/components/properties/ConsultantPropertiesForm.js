'use strict'

import React, { Component } from 'react'

import './ConsultantPropertiesForm.scss'

export default class ConsultantPropertiesForm extends Component {
  constructor (props) {
    super(props)
    this.onValueChange = this.onValueChange.bind(this)
    this.state = {
      errors: null,
      consultant: null,
      workProfile: null
    }
  }

  onValueChange (section, fieldName) {
    return (event) => {
      const consultant = Object.assign(
        this.state[section] || { },
        { [fieldName]: event.target.value }
      )
      this.setState({ consultant })
    }
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
    const { consultant } = this.props
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('email') ? '--error' : '')}>
          <div className='pl-form__section-label'>Personal information</div>
          <div className='pl-form__input pl-form__input-disabled'>
            <div className='pl-form__label'>Email</div>
            <input type='email'
              placeholder='e.g. ace@base.se'
              defaultValue={consultant.email}
              disabled
            />
            {this.renderError('email')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('firstName') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>First name</div>
            <input type='text'
              defaultValue={consultant.firstName}
              onChange={this.onValueChange('consultant', 'firstName')}
            />
            {this.renderError('firstName')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('lastName') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Last name</div>
            <input type='text'
              defaultValue={consultant.lastName}
              onChange={this.onValueChange('consultant', 'lastName')}
            />
          {this.renderError('lastName')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('phoneWork') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Phone (Work)</div>
            <input type='text'
              placeholder='e.g. +46 18 469548'
              defaultValue={consultant.profile && consultant.profile.phoneWork}
              onChange={this.onValueChange('consultant', 'phoneWork')}
            />
          {this.renderError('phoneWork')}
          </div>
        </div>
      </div>
    )
  }

  renderWorkProfileFormSection () {
    const workProfile = { }
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('firstName') ? '--error' : '')}>
          <div className='pl-form__section-label'>Work Profile</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              placeholder='e.g. Sales Representative'
              defaultValue={workProfile.title}
              onChange={this.onValueChange('workProfile', 'title')}
            />
            {this.renderError('title')}
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
