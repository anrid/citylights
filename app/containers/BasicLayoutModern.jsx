'use strict'

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import './BasicLayout.scss'

import * as settingsActions from '../actions/settingsActions'

import TopBar from '../components/TopBar'
import SideMenu from './SideMenu'
import PropertiesPanel from './PropertiesPanel'

function BasicLayout({ className, children }) {
  const dispatch = useDispatch()
  
  // Redux state using hooks
  const { saved, identity, backgrounds } = useSelector(state => state.settings)
  const workspaceId = saved?.workspaceId
  const userId = identity?.userId
  
  const user = useSelector(state => state.users.data[userId])
  const workspace = useSelector(state => state.workspaces.data[workspaceId])
  const workspaceList = useSelector(state => 
    state.workspaces.order.map(id => state.workspaces.data[id])
  )
  const activeTheme = saved?.activeTheme
  
  // Actions using dispatch
  const actions = {
    clearIdentity: () => dispatch(settingsActions.clearIdentity()),
    // Add other settingsActions as needed
    ...Object.keys(settingsActions).reduce((acc, key) => {
      if (typeof settingsActions[key] === 'function') {
        acc[key] = (...args) => dispatch(settingsActions[key](...args))
      }
      return acc
    }, {})
  }
  
  // Component props for child components
  const componentProps = {
    user,
    workspace,
    workspaceList,
    activeTheme,
    backgrounds,
    actions
  }

  let cls = className || ''
  
  // Select the theme background
  const background = backgrounds[activeTheme || 'BG4']
  const style = {}
  
  if (background) {
    if (background.url) {
      style.backgroundImage = `url("${background.url}")`
    }
    if (background.color) {
      style.backgroundColor = background.color
    }
    if (background.compact) {
      cls += ' pl-basic-layout--compact'
    }
  }

  return (
    <section className={'pl-basic-layout ' + cls} style={style}>
      <TopBar {...componentProps} onSignOut={actions.clearIdentity} />
      <div className='pl-basic-layout__main'>
        <SideMenu />
        <div className='pl-basic-layout__main-contents'>
          {children}
        </div>
        <PropertiesPanel />
      </div>
    </section>
  )
}

export default BasicLayout