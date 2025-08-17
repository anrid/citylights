'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './Avatar.scss'

export default class Avatar extends Component {
  render () {
    const { user, withName } = this.props

    // Handle case where user is undefined or null
    if (!user) {
      return (
        <div className='pl-time-planner-avatar'>
          <div className='pl-time-planner-avatar__photo' />
          {withName && (
            <div className='pl-time-planner-avatar__name'>
              Loading...
              <i className='fa fa-angle-down' />
            </div>
          )}
        </div>
      )
    }

    // Handle case where user.profile doesn't exist
    const photoUrl = user.profile?.photo || ''

    return (
      <div className='pl-time-planner-avatar'>
        <div className='pl-time-planner-avatar__photo'
          style={{ backgroundImage: photoUrl ? `url("${photoUrl}")` : 'none' }} />
        {withName && (
          <div className='pl-time-planner-avatar__name'>
            {user.firstName || 'User'}
            <i className='fa fa-angle-down' />
          </div>
        )}
      </div>
    )
  }
}

Avatar.propTypes = {
  user: PropTypes.object,
  withName: PropTypes.bool
}
