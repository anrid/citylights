'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Login.scss'

import * as settingsActions from '../../actions/settingsActions'
import Spinner from '../../components/Spinner'
import { getPopupError } from '../errorUtils'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      clean: true,
      email: this.props.email,
      password: 'test123'
    }
  }

  componentDidUpdate () {
    if (this.state.clean) {
      this.refs.email.focus()
    }
  }

  renderSubmitButton () {
    const { isConnected, isRequestInProgress } = this.props
    const { login } = this.props.actions
    if (!isConnected || isRequestInProgress) {
      return <Spinner/>
    }
    return (
      <button onClick={() => login(this.state.email, this.state.password)}>
        Login
      </button>
    )
  }

  render () {
    const { isConnected, error } = this.props
    const { routeTo } = this.props.actions
    return (
      <section
        className='pl-login'
        style={{ backgroundImage: 'url("https://farm3.staticflickr.com/2836/12431136253_1ff3466b8f_b.jpg")' }}
      >
        <div className='pl-login__box'>

          {getPopupError(error)}

          <div className='pl-heading--large pl-login__title'>
            Login
          </div>

          <div className='pl-input-field-box'>
            <input
              type='email'
              ref='email'
              maxLength={140}
              disabled={!isConnected}
              placeholder='Email'
              className='pl-input-field--top'
              onChange={(e) => this.setState({ email: e.target.value, clean: false })}
              value={this.state.email}
            />
          </div>

          <div className='pl-input-field-box'>
            <input
              type='password'
              maxLength={140}
              disabled={!isConnected}
              placeholder='Password'
              className='pl-input-field--bottom'
              onChange={(e) => this.setState({ password: e.target.value, clean: false })}
              value={this.state.password}
            />
          </div>

          <div className='pl-login__buttons'>
            {this.renderSubmitButton()}
          </div>

          <div
            className='pl-login__links pl-link-text'
            onClick={() => routeTo({ url: '/signup' })}
          >
            Don’t have an account yet ?<br/>
            Sign up <em>here</em>
          </div>

        </div>
      </section>
    )
  }
}

function mapStateToProps (state) {
  // console.log('Login: state=', state)
  const { settings } = state
  return {
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
)(Login)
