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

  renderAssigeesSection () {
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (this.hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label'>Assignees</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Consultants</div>
          </div>
        </div>
      </div>
    )
  }

  renderShiftInformationSection () {
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

        <div className={'pl-form__row' + (this.hasError('startDate') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Start Date</div>
            <input type='text'
              placeholder='e.g. 2016-05-01 10:00'
              defaultValue={shift.profile && shift.profile.startDate}
              onChange={this.onValueChange('shift', 'startDate')}
            />
            <div className='pl-form__help-text'>
              Date and time formats are flexible,
              e.g. both 5/1/2016 10:00am and 2016-05-01 10:00:00
              represent the May 1st 2016 at 10:00 am.
            </div>
          {this.renderError('startDate')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('endDate') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>End Date</div>
            <input type='text'
              placeholder='e.g. 2016-05-01 18:00'
              defaultValue={shift.profile && shift.profile.endDate}
              onChange={this.onValueChange('shift', 'endDate')}
            />
          {this.renderError('endDate')}
          </div>
        </div>

        <div className={'pl-form__row' + (this.hasError('rateHour') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Hourly Rate (US dollars)</div>
            <input type='text'
              placeholder='e.g. 29.95'
              defaultValue={shift.profile && shift.profile.rateHour}
              onChange={this.onValueChange('shift', 'rateHour')}
            />
            <div className='pl-form__help-text'>
              The hourly rate in USD.
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
        {this.renderShiftInformationSection()}
        {this.renderAssigeesSection()}
      </section>
    )
  }
}

ShiftPropertiesForm.propTypes = {
  shift: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
}
