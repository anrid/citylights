'use strict'

import React, { Component } from 'react'

import './ShiftPropertiesForm.scss'

export default class ShiftPropertiesForm extends Component {
  constructor (props) {
    super(props)
    this.onValueChange = this.onValueChange.bind(this)
    this.state = {
      errors: null,
      shift: null
    }
  }

  onValueChange (section, fieldName) {
    return (event) => {
      const shift = Object.assign(
        this.state[section] || { },
        { [fieldName]: event.target.value }
      )
      this.setState({ shift })
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

  renderFormSection () {
    const { shift } = this.props
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('email') ? '--error' : '')}>
          <div className='pl-form__section-label'>Personal information</div>
          <div className='pl-form__input pl-form__input-disabled'>
            <div className='pl-form__label'>Email</div>
            <input type='email'
              placeholder='e.g. ace@base.se'
              defaultValue={shift.email}
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
              defaultValue={shift.firstName}
              onChange={this.onValueChange('shift', 'firstName')}
            />
            {this.renderError('firstName')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('lastName') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Last name</div>
            <input type='text'
              defaultValue={shift.lastName}
              onChange={this.onValueChange('shift', 'lastName')}
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
              defaultValue={shift.profile && shift.profile.phoneWork}
              onChange={this.onValueChange('shift', 'phoneWork')}
            />
          {this.renderError('phoneWork')}
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <section className='pl-shift-properties-form'>
        {this.renderFormSection()}
      </section>
    )
  }
}

ShiftPropertiesForm.propTypes = {
  shift: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
}
