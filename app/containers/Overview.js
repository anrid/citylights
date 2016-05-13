'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Overview.scss'

import * as settingsActions from '../actions/settingsActions'

import SideMenu from '../components/SideMenu'
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
    const { backgrounds, workspace, isAppLoaded } = this.props
    if (!isAppLoaded) {
      return <div>Loading..</div>
    }

    const activity = [
      { _id: 1, text: 'Ace logged in' },
      { _id: 2, text: 'Base joined our crew' }
    ]

    return (
      <section
        className='pl-overview'
        style={{ backgroundImage: `url("${backgrounds.BG4.url}")` }}
      >
        <div className='pl-title'>
          {workspace.name}
        </div>

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
  return {
    isAppLoaded: state.settings.isAppLoaded,
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
