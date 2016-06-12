'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'

import './TopNav.scss'

import DropdownButton from './DropdownButton'
import Avatar from './Avatar'

class TopNav extends Component {
  render () {
    const menuItems = [
      { text: 'Projects' },
      { text: 'Team' },
      { text: 'Export' }
    ]

    const { currentUser, actions } = this.props
    const { routeTo } = actions

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
}

const NavButton = ({ children, noPadding, onClick }) => (
  <div className={'pl-time-planner-top-nav__nav-button' + (noPadding ? '--no-padding' : '')}
    onClick={onClick || null}
    >
    {children}
  </div>
)

function mapStateToProps (state) {
  return {
    currentUser: state.users.data[state.settings.identity.userId]
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopNav)
