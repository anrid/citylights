'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Overview.scss'

import * as settingsActions from '../actions/settingsActions'

class Overview extends Component {
  render () {
    const { backgrounds, workspace, isAppLoaded } = this.props
    const { routeTo, clearIdentity } = this.props.actions
    if (!isAppLoaded) {
      return <div>Loading..</div>
    }

    return (
      <section
        className='pl-overview'
        style={{ backgroundImage: `url("${backgrounds.BG4.url}")` }}
      >
        <div className='pl-title'>
          Workspace: {workspace.name}
        </div>

        <div className='pl-heading--large'>
          Overview
        </div>

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
