'use strict'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import './ConsultantPropertiesForm.scss'

function ConsultantPropertiesForm(props) {
  const c = props.consultant || { }
  const [errors, setErrors] = useState(null)
  const [consultant, setConsultant] = useState({
    email: c.email,
    firstName: c.firstName,
    lastName: c.lastName
  })
  const [workProfile, setWorkProfile] = useState({
    title: c.profile.title,
    phoneWork: c.profile.phoneWork
  })

  const onValueChange = useCallback((section, fieldName) => {
    return (event) => {
      const value = event.target.value
      if (section === 'consultant') {
        setConsultant(prev => ({ ...prev, [fieldName]: value }))
      } else if (section === 'workProfile') {
        setWorkProfile(prev => ({ ...prev, [fieldName]: value }))
      }
    }
  }, [])

  const onSave = useCallback(() => {
    const { consultant: originalConsultant, actions } = props
    Object.keys(consultant).forEach((x) => {
      if (originalConsultant[x] !== consultant[x]) {
        console.log('Saving', x, consultant[x])
        actions.updateUser(originalConsultant._id, x, consultant[x])
      }
    })
  }, [consultant, props])

  const onSaveWorkProfile = useCallback(() => {
    const { consultant: originalConsultant, actions } = props
    Object.keys(workProfile).forEach((x) => {
      if (originalConsultant.profile[x] !== workProfile[x]) {
        console.log('Saving', x, workProfile[x])
        actions.updateWorkProfile(originalConsultant._id, x, workProfile[x])
      }
    })
  }, [workProfile, props])

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

  const renderPersonalInformationFormSection = useCallback(() => {
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (hasError('email') ? '--error' : '')}>
          <div className='pl-form__section-label'>Personal information</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Email</div>
            <input type='text'
              value={consultant.email}
              onChange={onValueChange('consultant', 'email')}
              onBlur={onSave}
            />
            {renderError('email')}
          </div>
        </div>

        <div className={'pl-form__row' + (hasError('firstName') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>First name</div>
            <input type='text'
              value={consultant.firstName}
              onChange={onValueChange('consultant', 'firstName')}
              onBlur={onSave}
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
              onChange={onValueChange('consultant', 'lastName')}
              onBlur={onSave}
            />
          {renderError('lastName')}
          </div>
        </div>
      </div>
    )
  }, [consultant, hasError, renderError, onValueChange, onSave])

  const renderWorkProfileFormSection = useCallback(() => {
    return (
      <div className='pl-form__section'>
        <div className={'pl-form__row' + (hasError('firstName') ? '--error' : '')}>
          <div className='pl-form__section-label'>Work Profile</div>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Title</div>
            <input type='text'
              placeholder='e.g. Sales Representative'
              value={workProfile.title}
              onChange={onValueChange('workProfile', 'title')}
              onBlur={onSaveWorkProfile}
            />
            {renderError('title')}
          </div>
        </div>

        <div className={'pl-form__row' + (hasError('phoneWork') ? '--error' : '')}>
          <div className='pl-form__section-label'/>
          <div className='pl-form__input'>
            <div className='pl-form__label'>Phone (Work)</div>
            <input type='text'
              placeholder='e.g. +46 18 469548'
              value={workProfile.phoneWork}
              onChange={onValueChange('workProfile', 'phoneWork')}
              onBlur={onSaveWorkProfile}
            />
          {renderError('phoneWork')}
          </div>
        </div>
      </div>
    )
  }, [workProfile, hasError, renderError, onValueChange, onSaveWorkProfile])

  return (
    <section className='pl-consultant-properties-form'>
      {renderPersonalInformationFormSection()}
      {renderWorkProfileFormSection()}
    </section>
  )
}

ConsultantPropertiesForm.propTypes = {
  consultant: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

export default ConsultantPropertiesForm
