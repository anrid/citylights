'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Overview.scss'

import * as settingsActions from '../../actions/settingsActions'

import BasicLayout from '../BasicLayout'
import ActivityFeed from '../../components/ActivityFeed'
import Loader from '../Loader'

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
    const activity = [
      { _id: 1, text: 'Ace logged in' },
      { _id: 2, text: 'Base joined our crew' }
    ]

    return (
      <BasicLayout className='pl-overview'>
        <ActivityFeed activity={activity} />
      </BasicLayout>
    )
  }
}

function mapStateToProps (state) {
  return {
    // TODO: Load workspace activity here.
    settings: state.settings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

const ConnectedOverview = connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview)

const OverviewPage = () => (
  <Loader page={ConnectedOverview} />
)

export default OverviewPage
