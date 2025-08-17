'use strict'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import * as settingsActions from '../actions/settingsActions'

import './TopNav.scss'

import DropdownButton from './DropdownButton'
import Avatar from './Avatar'

function TopNav() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const identity = useSelector(state => state.settings.identity)
  const users = useSelector(state => state.users.data)
  
  // Get current user - handle different identity structures
  let currentUser = null
  if (identity) {
    if (identity.userId) {
      // Legacy structure: identity.userId points to users data
      currentUser = users[identity.userId]
    } else if (identity._id) {
      // Direct user structure: identity contains user data
      currentUser = identity
    }
  }

  const menuItems = [
    { text: 'Projects' },
    { text: 'Team' },
    { text: 'Export' }
  ]

  const routeTo = (url) => {
    if (url === '/') {
      navigate('/')
    } else {
      dispatch(settingsActions.routeTo({ url }))
    }
  }

  return (
    <section className='pl-time-planner-top-nav'>
      <div className='pl-time-planner-top-nav__left'>
        <div className='pl-time-planner-top-nav__company-name'>
          Rocksteady Consulting
        </div>
        <div className='pl-time-planner-top-nav__divider' />
        <DropdownButton selected='Projects' items={menuItems} />
      </div>
      <div className='pl-time-planner-top-nav__right'>
        <NavButton onClick={() => routeTo('/')}>
          <i className='fa fa-fw fa-angle-left' /> Back to the City !
        </NavButton>
        <NavButton>Help</NavButton>
        <NavButton>Settings</NavButton>
        <NavButton noPadding><Avatar user={currentUser} withName /></NavButton>
      </div>
    </section>
  )
}

const NavButton = ({ children, noPadding, onClick }) => (
  <div className={'pl-time-planner-top-nav__nav-button' + (noPadding ? '--no-padding' : '')}
    onClick={onClick || null}
    >
    {children}
  </div>
)

export default TopNav
