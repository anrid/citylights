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
        <div className={'pl-form__row' + (this.hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label'>Shift information</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              defaultValue={shift.title}
              onChange={this.onValueChange('shift', 'title')}
            />
          {this.renderError('title')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('rateHour') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Hourly Rate (in US cents)</div>
            <input type='text'
              placeholder='e.g. 5,000'
              defaultValue={shift.profile && shift.profile.rateHour}
              onChange={this.onValueChange('shift', 'rateHour')}
            />
            <div className='pl-form__help-text'>
              The hourly rate in US cents. For example, type 5,000 to express $50 USD.
            </div>
          {this.renderError('rateHour')}
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
