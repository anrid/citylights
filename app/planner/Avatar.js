'use strict'

import React, { Component } from 'react'

import './Avatar.scss'

export default class Avatar extends Component {
  render () {
    const { user, withName } = this.props

    return (
      <div className='pl-time-planner-avatar'>
        <div className='pl-time-planner-avatar__photo'
          style={{ backgroundImage: `url("${user.profile.photo}")` }} />
        {withName && (
          <div className='pl-time-planner-avatar__name'>
            {user.firstName}
            <i className='fa fa-angle-down' />
          </div>
        )}
      </div>
    )
  }
}

Avatar.propTypes = {
  user: React.PropTypes.object.isRequired,
  withName: React.PropTypes.bool
}
