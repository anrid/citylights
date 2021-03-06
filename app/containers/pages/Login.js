'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Motion, spring } from 'react-motion'

import './Login.scss'

import * as settingsActions from '../../actions/settingsActions'
import Spinner from '../../components/Spinner'
import { getPopupError } from '../errorUtils'

const springModel = { stiffness: 150, damping: 13 }
const fadeModel = { stiffness: 50, damping: 9 }
const lettersModel = { stiffness: 150, damping: 13 }

const logoStartValues = {
  scale: 2,
  fade: 0,
  spacing: 2
}

const logoSpring = {
  scale: spring(1, springModel),
  fade: spring(1, fadeModel),
  spacing: spring(-0.5, lettersModel)
}

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      clean: true,
      // HACK: Use `test@example.com` for demo purposes.
      email: this.props.email || 'test@example.com',
      // HACK: Use any password as `@example.com` emails are essentially passwordless.
      password: 'test123',
      animationComplete: false
    }
    this.onAnimationComplete = this.onAnimationComplete.bind(this)
  }

  onAnimationComplete () {
    this.setState({ animationComplete: true })
  }

  focus () {
    if (this.state.clean) {
      this.refs.email.focus()
    }
  }

  componentDidMount () {
    this.focus()
  }

  componentDidUpdate () {
    this.focus()
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
        <Motion
          defaultStyle={logoStartValues}
          style={logoSpring}
          onRest={this.onAnimationComplete}
        >
          {({ scale, fade, spacing }) => (
            <div className='pl-login__logo' style={{
              transform: `scale(${scale},${scale})`,
              opacity: fade,
              letterSpacing: `${spacing}px`
            }}>
              Citylights<span style={{ visibility: !this.state.animationComplete ? 'hidden' : 'visible' }}>.</span>
            </div>
          )}
        </Motion>

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
            <PopupTip>
              <div>We’re good to go!</div>
              <div>Click Login to run the demo app.</div>
            </PopupTip>
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

const PopupTip = ({ children }) => (
  <Motion
    defaultStyle={{ scale: 0.5, fade: 0, left: 100 }}
    style={{
      scale: spring(1, { stiffness: 150, damping: 20 }),
      fade: spring(1, fadeModel),
      left: spring(1, fadeModel)
    }}
  >
    {({ scale, fade, left }) => (
      <div className='pl-login__popup-message' style={{
        transform: `scale(${scale},${scale}) translateX(${left}px)`,
        opacity: fade
      }}>
        <div className='pl-login__popup-message-tri' />
        {children}
      </div>
    )}
  </Motion>
)

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
