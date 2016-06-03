'use strict'

import React, { Component } from 'react'

import './Avatar.scss'
import * as names from '../reducers/generators/names'

export default class Avatar extends Component {
  render () {
    // TODO: Redux me.
    const user = {
      _id: 1,
      email: 'massa.c@example.com',
      firstName: 'Massa',
      lastName: 'Curry',
      photo: names.getRandomAvatar('2016-06-02'),
      title: names.getRandomConsultantTitle('2016-06-01')
    }

    const { withName } = this.props

    return (
      <div className='pl-time-planner-avatar'>
        <div className='pl-time-planner-avatar__photo' style={{ backgroundImage: `url("${user.photo}")` }} />
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
  withName: React.PropTypes.bool
}
