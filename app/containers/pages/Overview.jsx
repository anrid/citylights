'use strict'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import './Overview.scss'

import * as settingsActions from '../../actions/settingsActions'

import BasicLayout from '../BasicLayout'
import ActivityFeed from '../../components/ActivityFeed'
import Loader from '../Loader'

function Overview() {
  const dispatch = useDispatch()
  const settings = useSelector(state => state.settings)
  
  // Create action handlers
  const routeTo = (route) => dispatch(settingsActions.routeTo(route))
  const clearIdentity = () => dispatch(settingsActions.clearIdentity())
  
  const renderButtons = () => {
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

// Keep the same Loader wrapper pattern for consistency
const OverviewPage = () => (
  <Loader page={Overview} />
)

export default OverviewPage
