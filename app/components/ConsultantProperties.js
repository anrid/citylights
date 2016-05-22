'use strict'

import React, { Component } from 'react'

import './ConsultantProperties.scss'

import Dropdown from './Dropdown'

export default class ConsultantProperties extends Component {
  constructor (props) {
    super(props)
    this.onDropdownSelect = this.onDropdownSelect.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.state = {
      editMode: false,
      errors: null,
      consultant: null,
      workProfile: null
    }
  }

  onDropdownSelect (command) {
    console.log('TODO: Perform some dropdown action, command=', command)
  }

  renderDropdown () {
    const menuItems = [
      { _id: 1, text: 'Action #1' },
      { _id: 2, text: 'Action #2' }
    ]

    return (
      <Dropdown
        closeOnSelect
        items={menuItems}
        caretOnly
        onSelect={this.onDropdownSelect}
      />
    )
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

  renderEditForm () {
    return (
      <section className='pl-consultant-properties__edit-form'>
        {this.renderPersonalInformationFormSection()}
        {this.renderWorkProfileFormSection()}
      </section>
    )
  }

  renderProfile () {
    const { consultant } = this.props
    if (!consultant) {
      return (
        <div className='pl-box__content-empty'>
          <div className='pl-box__content-empty__text'>
            No consultant found.
          </div>
        </div>
      )
    }
    return (
      <div className='pl-consultant-properties__profile'>
        <div className='pl-consultant-properties__profile-block'>

          <div className='pl-consultant-properties__profile-photo'
            style={{ backgroundImage: `url(${consultant.photo})` }}/>

          <div className='pl-consultant-properties__profile-personal-info'>
            <div className='pl-consultant-properties__profile-entry'>
              <div className='pl-consultant-properties__profile-label'>
                Name:
              </div>
              <div className='pl-consultant-properties__profile-big-text'>
                {consultant.firstName} {consultant.lastName}
              </div>
            </div>

            <div className='pl-consultant-properties__profile-entry'>
              <div className='pl-consultant-properties__profile-label'>
                Age:
              </div>
              <div className='pl-consultant-properties__profile-big-text'>
                {Math.floor(Math.random() * 10) + 20}
              </div>
            </div>

            <div className='pl-consultant-properties__profile-entry'>
              <div className='pl-consultant-properties__profile-label'>
                Gender:
              </div>
              <div className='pl-consultant-properties__profile-big-text'>
                <i className='fa fa-venus' />
              </div>
            </div>

          </div>

        </div>
      </div>
    )
  }

  render () {
    const { consultant } = this.props
    const { editMode } = this.state
    return (
      <section className='pl-box pl-consultant-properties'>
        <div className='pl-box__header'>
          <div>Consultant: {consultant.firstName} {consultant.lastName}</div>
          {this.renderDropdown()}
        </div>
        <div className='pl-box__content pl-box__content--with-footer pl-box__content--no-padding'>
          {editMode
            ? this.renderEditForm()
            : this.renderProfile()
          }
        </div>
        <div className='pl-box__footer'>
          <div>Status: Inloggad.</div>
          {editMode
            ? <div className='pl-link' onClick={() => this.setState({ editMode: false })}>back</div>
            : <div className='pl-link' onClick={() => this.setState({ editMode: true })}>edit</div>
          }
        </div>
      </section>
    )
  }
}

ConsultantProperties.propTypes = {
  consultant: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
}
