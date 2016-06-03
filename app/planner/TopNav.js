'use strict'

import React, { Component } from 'react'

import './TopNav.scss'

import DropdownButton from './DropdownButton'
import Avatar from './Avatar'

export default class TopNav extends Component {
  render () {
    const menuItems = [
      { text: 'Projects' },
      { text: 'Team' },
      { text: 'Export' }
    ]

    return (
      <section className='pl-time-planner-top-nav'>
        <div className='pl-time-planner-top-nav__left'>
          <div className='pl-time-planner-top-nav__company-name'>Rock on.</div>
          <div className='pl-time-planner-top-nav__divider' />
          <DropdownButton selected='Projects' items={menuItems} />
        </div>
        <div className='pl-time-planner-top-nav__right'>
          <NavButton>Help</NavButton>
          <NavButton>Settings</NavButton>
          <NavButton noPadding><Avatar withName /></NavButton>
        </div>
      </section>
    )
  }
}

const NavButton = ({ children, noPadding }) => (
  <div className={'pl-time-planner-top-nav__nav-button' + (noPadding ? '--no-padding' : '')}>
    {children}
  </div>
)
