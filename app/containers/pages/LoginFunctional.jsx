'use strict'

import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Motion, spring } from 'react-motion'

import './Login.scss'

import * as settingsActions from '../../actions/settingsActions'
import Spinner from '../../components/Spinner.jsx'
import { getPopupError } from '../errorUtils.jsx'

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

function Login() {
  const dispatch = useDispatch()
  
  // Redux state
  const { isConnectedToServer, isRequestInProgress, saved, serverError } = useSelector(state => state.settings)
  
  // Local state
  const [clean, setClean] = useState(true)
  const [email, setEmail] = useState(saved?.email || 'test@example.com')
  const [password, setPassword] = useState('test123')
  const [animationComplete, setAnimationComplete] = useState(false)
  
  // Refs
  const emailRef = useRef(null)
  
  // Actions
  const login = (email, password) => dispatch(settingsActions.login(email, password))
  const routeTo = (route) => dispatch(settingsActions.routeTo(route))
  
  // Effects
  useEffect(() => {
    if (clean) {
      emailRef.current?.focus()
    }
  })
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setClean(false)
  }
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setClean(false)
  }
  
  const handleLogin = () => {
    login(email, password)
  }
  
  const handleAnimationComplete = () => {
    setAnimationComplete(true)
  }
  
  const renderSubmitButton = () => {
    if (!isConnectedToServer || isRequestInProgress) {
      return <Spinner/>
    }
    return (
      <button onClick={handleLogin}>
        Login
      </button>
    )
  }
  
  return (
    <section
      className='pl-login'
      style={{ backgroundImage: 'url("https://farm3.staticflickr.com/2836/12431136253_1ff3466b8f_b.jpg")' }}
    >
      <Motion
        defaultStyle={logoStartValues}
        style={logoSpring}
        onRest={handleAnimationComplete}
      >
        {({ scale, fade, spacing }) => (
          <div className='pl-login__logo' style={{
            transform: `scale(${scale},${scale})`,
            opacity: fade,
            letterSpacing: `${spacing}px`
          }}>
            Citylights<span style={{ visibility: !animationComplete ? 'hidden' : 'visible' }}>.</span>
          </div>
        )}
      </Motion>

      <div className='pl-login__box'>
        
        {getPopupError(serverError)}
        
        <div className='pl-heading--large pl-login__title'>
          Login
        </div>
        
        <div className='pl-input-field-box'>
          <input
            type='email'
            ref={emailRef}
            maxLength={140}
            disabled={!isConnectedToServer}
            placeholder='Email'
            className='pl-input-field--top'
            onChange={handleEmailChange}
            value={email}
          />
        </div>
        
        <div className='pl-input-field-box'>
          <input
            type='password'
            maxLength={140}
            disabled={!isConnectedToServer}
            placeholder='Password'
            className='pl-input-field--bottom'
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        
        <div className='pl-login__buttons'>
          {renderSubmitButton()}
          <PopupTip>
            <div>We're good to go!</div>
            <div>Click Login to run the demo app.</div>
          </PopupTip>
        </div>
        
        <div
          className='pl-login__links pl-link-text'
          onClick={() => routeTo({ url: '/signup' })}
        >
          Don't have an account yet ?<br/>
          Sign up <em>here</em>
        </div>
        
      </div>
    </section>
  )
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

export default Login