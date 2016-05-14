'use strict'

import React, { Component } from 'react'

import './TopBar.scss'

export default class TopBar extends Component {
  render () {
    const {
      user,
      workspace,
      onSignOut
    } = this.props

    return (
      <section className='pl-top-bar'>
        <div className='pl-title'>
          {workspace.name}
        </div>
        <div className='pl-top-bar__info'>
          <div className='pl-top-bar__avatar' />

          <div className='pl-top-bar__whoami'>
            {user.email}
          </div>

          <div className='pl-top-bar__sign-out' onClick={onSignOut}>
            — <span>Sign Out</span>
          </div>
        </div>
      </section>
    )
  }
}
