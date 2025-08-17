'use strict'

import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as settingsActions from '../../actions/settingsActions'
import Spinner from '../../components/Spinner.jsx'
import { getPopupError } from '../errorUtils'

import './Signup.scss'

function Signup() {
  const dispatch = useDispatch()
  
  // Redux state
  const { backgrounds, isConnectedToServer, isRequestInProgress, serverError } = useSelector(state => state.settings)
  
  // Local state
  const [clean, setClean] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  
  // Refs
  const companyNameRef = useRef(null)
  
  // Action handlers
  const signup = (userData) => dispatch(settingsActions.signup(userData))
  const routeTo = (route) => dispatch(settingsActions.routeTo(route))
  
  // Focus management
  useEffect(() => {
    if (clean) {
      companyNameRef.current?.focus()
    }
  }, [clean])

  const renderSubmitButton = () => {
    if (!isConnectedToServer || isRequestInProgress) {
      return <Spinner/>
    }
    return (
      <button onClick={() => signup({ firstName, lastName, companyName, email })}>
        Do it.
      </button>
    )
  }

  return (
    <section
      className='pl-login pl-signup'
      style={{ backgroundImage: `url("${backgrounds.BG1.url}")` }}
    >
      <div className='pl-login__box'>

        {getPopupError(serverError)}

        <div className='pl-heading--large pl-login__title'>
          Sign Up
        </div>

        <div className='pl-input-field-box'>
          <input
            type='text'
            ref={companyNameRef}
            maxLength={140}
            disabled={!isConnectedToServer}
            placeholder='Company Name'
            className='pl-input-field'
            onChange={(e) => {
              setCompanyName(e.target.value)
              setClean(false)
            }}
            value={companyName}
          />
        </div>

        <div className='pl-input-field-group pl-input-field-box'>
          <input
            type='text'
            maxLength={140}
            disabled={!isConnectedToServer}
            placeholder='First Name'
            className='pl-input-field'
            onChange={(e) => {
              setFirstName(e.target.value)
              setClean(false)
            }}
            value={firstName}
          />
          <input
            type='text'
            maxLength={140}
            disabled={!isConnectedToServer}
            placeholder='Last Name'
            className='pl-input-field'
            onChange={(e) => {
              setLastName(e.target.value)
              setClean(false)
            }}
            value={lastName}
          />
        </div>

        <div className='pl-input-field-box'>
          <input
            type='email'
            maxLength={140}
            disabled={!isConnectedToServer}
            placeholder='Email'
            className='pl-input-field'
            onChange={(e) => {
              setEmail(e.target.value)
              setClean(false)
            }}
            value={email}
          />
        </div>

        <div className='pl-login__buttons'>
          {renderSubmitButton()}
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

export default Signup
