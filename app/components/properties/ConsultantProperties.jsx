'use strict'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import './ConsultantProperties.scss'

import Dropdown from '../widgets/Dropdown'
import ConsultantPropertiesForm from './ConsultantPropertiesForm'

function ConsultantProperties(props) {
  const { consultant } = props
  const [editMode, setEditMode] = useState(false)

  const onDropdownSelect = useCallback((command) => {
    console.log('TODO: Perform some dropdown action, command=', command)
  }, [])

  const renderDropdown = useCallback(() => {
    const menuItems = [
      { _id: 1, text: 'Action #1' },
      { _id: 2, text: 'Action #2' }
    ]

    return (
      <Dropdown
        closeOnSelect
        items={menuItems}
        caretOnly
        onSelect={onDropdownSelect}
      />
    )
  }, [onDropdownSelect])

  const renderProfile = useCallback(() => {
    if (!consultant) {
      return (
        <div className='pl-box__content-empty'>
          <div className='pl-box__content-empty__text'>
            No consultant found.
          </div>
        </div>
      )
    }

    // console.log('Render consultant=', consultant)

    return (
      <div className='pl-consultant-properties__profile'>
        <div className='pl-consultant-properties__profile-block'>
          <div className='pl-consultant-properties__left'>
            <div className='pl-consultant-properties__profile-photo'
              style={{ backgroundImage: `url(${consultant.profile.photo})` }}/>
          </div>

          <div className='pl-consultant-properties__right'>
            <div className='pl-consultant-properties__personal-info'>
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
                  {consultant.profile.age}
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

            <div className='pl-consultant-properties__columns'>
              <div className='pl-consultant-properties__profile-entry'>
                <div className='pl-consultant-properties__profile-label'>
                  Title:
                </div>
                <div className='pl-consultant-properties__profile-medium-text'>
                  {consultant.profile.title}
                </div>
              </div>

              <div className='pl-consultant-properties__profile-entry'>
                <div className='pl-consultant-properties__profile-label'>
                  Phone (Work):
                </div>
                <div className='pl-consultant-properties__profile-medium-text'>
                  {consultant.profile.phoneWork}
                </div>
              </div>
            </div>

            <div className='pl-consultant-properties__columns'>
              <div className='pl-consultant-properties__profile-entry'>
                <div className='pl-consultant-properties__profile-label'>
                  Email:
                </div>
                <div className='pl-consultant-properties__profile-small-text'>
                  {consultant.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }, [consultant])

  return (
    <section className='pl-box pl-consultant-properties'>
      <div className='pl-box__header'>
        <div>Consultant: {consultant.firstName} {consultant.lastName}</div>
        {renderDropdown()}
      </div>
      <div className='pl-box__content pl-box__content--with-footer pl-box__content--no-padding'>
        {editMode
          ? <ConsultantPropertiesForm {...props} />
          : renderProfile()
        }
      </div>
      <div className='pl-box__footer'>
        <div>Status: Logged in.</div>
        {editMode
          ? <div className='pl-link' onClick={() => setEditMode(false)}>back</div>
          : <div className='pl-link' onClick={() => setEditMode(true)}>edit</div>
        }
      </div>
    </section>
  )
}

ConsultantProperties.propTypes = {
  consultant: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

export default ConsultantProperties
