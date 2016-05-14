'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import Spinner from '../components/Spinner'
import { getPopupError } from './errorUtils'

import './Signup.scss'

class Signup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      clean: true,
      companyName: 'Rocksteady Consulting',
      email: 'user10@example.com'
    }
  }

  componentDidUpdate () {
    if (this.state.clean) {
      this.refs.email.focus()
    }
  }

  renderSubmitButton () {
    const { isConnected, isRequestInProgress } = this.props
    const { signup } = this.props.actions
    if (!isConnected || isRequestInProgress) {
      return <Spinner/>
    }
    return (
      <button onClick={() => signup(this.state.companyName, this.state.email)}>
        Do it.
      </button>
    )
  }

  render () {
    const { isConnected, error, backgrounds } = this.props
    const { routeTo } = this.props.actions
    return (
      <section
        className='pl-login pl-signup'
        style={{ backgroundImage: `url("${backgrounds.BG1.url}")` }}
      >
        <div className='pl-login__box'>

          {getPopupError(error)}

          <div className='pl-heading--large pl-login__title'>
            Sign Up
          </div>

          <div className='pl-input-field-box'>
            <input
              type='text'
              maxLength={140}
              disabled={!isConnected}
              placeholder='Company Name'
              className='pl-input-field'
              onChange={(e) => this.setState({ companyName: e.target.value, clean: false })}
              value={this.state.companyName}
            />
          </div>

          <div className='pl-input-field-box'>
            <input
              type='email'
              ref='email'
              maxLength={140}
              disabled={!isConnected}
              placeholder='Email'
              className='pl-input-field'
              onChange={(e) => this.setState({ email: e.target.value, clean: false })}
              value={this.state.email}
            />
          </div>

          <div className='pl-login__buttons'>
            {this.renderSubmitButton()}
          </div>

          <div
            className='pl-login__links pl-link-text'
            onClick={() => routeTo({ url: '/login' })}
          >
            Already have an account ?<br/>
            <em>Login here</em>
          </div>

        </div>
      </section>
    )
  }
}

function mapStateToProps (state) {
  // console.log('Signup: state=', state)
  const { settings } = state
  return {
    backgrounds: settings.backgrounds,
    isConnected: settings.isConnectedToServer,
    isRequestInProgress: settings.isRequestInProgress,
    email: settings.saved.email,
    error: settings.serverError
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
)(Signup)
