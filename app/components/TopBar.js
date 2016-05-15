'use strict'

import React, { Component } from 'react'

import './TopBar.scss'
import Dropdown from './Dropdown'
import { getWorkspaceMemberCount } from '../selectors/workspace'

export default class TopBar extends Component {
  constructor (props) {
    super(props)
    this.onSelectWorkspace = this.onSelectWorkspace.bind(this)
  }

  onSelectWorkspace (item) {
    const workspaceId = item._id
    console.log('Switch to workspace:', workspaceId)
  }

  render () {
    const {
      user,
      workspace,
      workspaceList,
      onSignOut
    } = this.props

    let slogan = null
    if (workspace.domain) {
      slogan = (
        <div className='pl-title-slogan'>
          @{workspace.domain.replace('@', '')}
        </div>
      )
    }

    const menuItems = workspaceList.map((x) => {
      const count = getWorkspaceMemberCount(x)
      return { _id: x._id, text: x.name, info: `(${count} members)` }
    })

    return (
      <section className='pl-top-bar'>
        <div className='pl-top-bar__title'>
          <div className='pl-title'>
            {workspace.name}
          </div>
          <Dropdown
            caretOnly
            items={menuItems}
            onSelect={this.onSelectWorkspace}
            heading='Switch to another Team'
            closeOnSelect
            selected={workspace.name}
          />
          {slogan}
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
