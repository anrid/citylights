'use strict'

import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import * as userActions from '../actions/userActions'

class ConsultantForm extends Component {
  constructor (props) {
    super(props)
    const { consultant } = this.props
    this.state = { ...consultant }
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange (fieldName) {
    return (event) => {
      this.setState({ [fieldName]: event.target.value })
    }
  }

  onSaveConsultantForm () {
    const { actions, workspaceId } = this.props
    const data = {
      ...this.state,
      workspaceId
    }
    actions.inviteUser(data)
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
          <button onClick={() => this.onSaveConsultantForm()}>
            Create
          </button>
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

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions,
      ...userActions
    }, dispatch)
  }
}

const ConnectedConsultantForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsultantForm)

export default ConnectedConsultantForm
