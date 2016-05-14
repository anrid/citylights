'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Overview.scss'

import * as settingsActions from '../actions/settingsActions'

import TopBar from '../components/TopBar'
import SideMenu from './SideMenu'
import ActivityFeed from '../components/ActivityFeed'

class Overview extends Component {
  renderButtons () {
    const { routeTo, clearIdentity } = this.props.actions
    return (
      <div className='pl-overview__buttons'>
        <button onClick={() => routeTo({ url: '/clients' })}>
          Clients
        </button>

        <button onClick={() => routeTo({ url: '/create-workspace' })}>
          Create a new Workspace
        </button>

        <button onClick={clearIdentity}>
          Log out
        </button>
      </div>
    )
  }

  render () {
    const {
      backgrounds,
      isAppLoaded,
      activeTheme
    } = this.props

    if (!isAppLoaded) {
      return (
        <div className='pl-loading'>
          Loading..
        </div>
      )
    }

    const activity = [
      { _id: 1, text: 'Ace logged in' },
      { _id: 2, text: 'Base joined our crew' }
    ]

    // Select the theme background.
    const background = backgrounds[activeTheme || 'BG4']
    const style = { }
    if (background && background.url) {
      style.backgroundImage = `url("${background.url}")`
    }

    return (
      <section className='pl-overview' style={style}>
        <TopBar {...this.props} onSignOut={this.props.actions.clearIdentity} />

        <div className='pl-overview__main'>
          <SideMenu />
          <ActivityFeed activity={activity} />
        </div>

      </section>
    )
  }
}

function mapStateToProps (state) {
  // console.log('Overview, state=', state)
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  const { userId } = state.settings.identity
  return {
    isAppLoaded: state.settings.isAppLoaded,
    user: state.users.data[userId],
    activeTheme: state.settings.saved.activeTheme,
    workspace: state.workspaces.data[workspaceId],
    backgrounds: state.settings.backgrounds
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
)(Overview)
