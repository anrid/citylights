'use strict'

import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'moment'

import { request } from '../lib/apiClient'
import * as settingsActions from '../actions/settingsActions'
import * as names from '../reducers/generators/names'

import './ConsultantForm.scss'

import SpinnerButton from './SpinnerButton.jsx'
import Button from '../planner/Button'

function ConsultantForm() {
  const dispatch = useDispatch()
  const workspaceId = useSelector(state => state.settings.saved.workspaceId)
  const userId = useSelector(state => state.settings.identity.userId)
  
  const [consultant, setConsultant] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneWork: '',
    title: '',
    photo: null
  })
  const [errors, setErrors] = useState(null)

  const onValueChange = useCallback((fieldName) => {
    return (event) => {
      setConsultant(prevConsultant => ({
        ...prevConsultant,
        [fieldName]: event.target.value
      }))
    }
  }, [])

  const onReturn = useCallback(() => {
    dispatch(settingsActions.routeTo('/consultants'))
  }, [dispatch])

  const onSaveConsultantForm = useCallback(() => {
    const data = {
      ...consultant,
      workspaceId
    }

    // Reset form errors on submit.
    // setErrors(null)

    request('user:invite', data)
    .then(onReturn)
    .catch((reason) => {
      if (reason.info && reason.info.error) {
        setErrors(reason.info.error.details)
      }
    })
  }, [consultant, workspaceId, onReturn])

  const hasError = useCallback((name) => {
    return errors && errors[name]
  }, [errors])

  const renderError = useCallback((name) => {
    if (!errors || !errors[name]) {
      return null
    }
    return (
      <div className='pl-form__error-text'>
        {errors[name]}
      </div>
    )
  }, [errors])

  const renderUserGenerator = useCallback(() => {
    const generate = () => {
      setConsultant(names.generateTestConsultantFormData(userId))
    }

    return (
      <div className='pl-form__row'>
        <div className='pl-form__section-label'></div>
        <div className='pl-form__input'>
          <Button onClick={generate}>
            Fill Form using Test Data
          </Button>
          <div className='pl-form__help-text'>
            This will generate a <b>fake</b> test consultant.<br/>
            <b>Only you</b> will have access to their account, including any emails or reports sent to them.
          </div>
        </div>
      </div>
    )
  }, [userId])

  const renderBasicInfoSection = useCallback(() => {
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (hasError('email') ? '--error' : '')}>
          <div className='pl-form__section-label'>Basic information</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Email</div>
            <input type='email'
              placeholder='e.g. ace@base.se'
              value={consultant.email}
              onChange={onValueChange('email')}
            />
            {renderError('email')}
          </div>
        </div>
        <div className={'pl-form__row' + (hasError('firstName') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>First name</div>
            <input type='text' className='karma-first-name'
              value={consultant.firstName}
              onChange={onValueChange('firstName')}
            />
            {renderError('firstName')}
          </div>
        </div>
        <div className={'pl-form__row' + (hasError('lastName') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Last name</div>
            <input type='text'
              value={consultant.lastName}
              onChange={onValueChange('lastName')}
            />
            {renderError('lastName')}
          </div>
        </div>
      </div>
    )
  }, [consultant, hasError, onValueChange, renderError])

  const renderWorkProfileSection = useCallback(() => {
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (hasError('phoneWork') ? '--error' : '')}>
          <div className='pl-form__section-label'>Work Profile</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Phone Number (Work)</div>
            <input type='text'
              placeholder='e.g +46 18 469548'
              value={consultant.phoneWork}
              onChange={onValueChange('phoneWork')}
            />
            {renderError('phoneWork')}
            <div className='pl-form__help-text'>
              Primary contact number for work related matters.
            </div>
          </div>
        </div>
        <div className={'pl-form__row' + (hasError('title') ? '--error' : '')}>
          <div className='pl-form__section-label' />
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              placeholder='e.g Project Manager'
              value={consultant.title}
              onChange={onValueChange('title')}
            />
            {renderError('title')}
            <div className='pl-form__help-text'>
              The consultants title or role.
            </div>
          </div>
        </div>
        {renderUserGenerator()}
      </div>
    )
  }, [consultant, hasError, onValueChange, renderError, renderUserGenerator])

  return (
    <section className='pl-form pl-consultant-form'>
      <div className='pl-form__header'>
        <div>Register a new Consultant</div>
      </div>

      <div className='pl-form__content'>
        {renderBasicInfoSection()}
        {renderWorkProfileSection()}
      </div>

      <div className='pl-form__footer'>
        <button
          className='pl-cancel-button'
          onClick={onReturn}
        >
          Back
        </button>
        <SpinnerButton onClick={onSaveConsultantForm}>
          Create
        </SpinnerButton>
      </div>
    </section>
  )
}

export default ConsultantForm
