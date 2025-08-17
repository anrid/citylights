'use strict'

import React from 'react'

import './TopBar.scss'
import Dropdown from './widgets/Dropdown'
import { getWorkspaceMemberCount } from '../selectors/workspaces'

function TopBar({ user, workspace, workspaceList, onSignOut }) {
  const onSelectWorkspace = (item) => {
    const workspaceId = item._id
    console.log('Switch to workspace:', workspaceId)
  }

  let slogan = null
  if (workspace && workspace.domain) {
    slogan = (
      <div className='pl-title-slogan'>
        @{workspace.domain.replace('@', '')}
      </div>
    )
  }

  const menuItems = workspaceList.map((x) => {
    const count = getWorkspaceMemberCount(x)
    const icon = <span><i className='fa fa-fw fa-male' /> {count}</span>
    return { _id: x._id, text: x.name, info: icon }
  })

  return (
    <section className='pl-top-bar'>
      <div className='pl-top-bar__title'>
        <div className='pl-title'>
          {workspace && workspace.name}
        </div>
        <Dropdown
          caretOnly
          items={menuItems}
          onSelect={onSelectWorkspace}
          heading='Switch to another Team'
          closeOnSelect
          selected={workspace && workspace.name}
        />
        {slogan}
      </div>
      <div className='pl-top-bar__info'>
        <div className='pl-top-bar__avatar pl-default-avatar' />

        <div className='pl-top-bar__whoami'>
          {user && user.email}
        </div>

        <div className='pl-top-bar__sign-out' onClick={onSignOut}>
          — <span>Sign Out</span>
        </div>
      </div>
    </section>
  )
}

export default TopBar
