'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './BasicLayout.scss'

import * as settingsActions from '../actions/settingsActions'

import TopBar from '../components/TopBar'
import SideMenu from './SideMenu'

class BasicLayout extends Component {
  render () {
    const {
      backgrounds,
      isAppLoaded,
      activeTheme,
      className,
      actions,
      children
    } = this.props

    if (!isAppLoaded) {
      return (
        <div className='pl-loading'>
          Loading..
        </div>
      )
    }

    // Select the theme background.
    const background = backgrounds[activeTheme || 'BG4']
    const style = { }
    if (background && background.url) {
      style.backgroundImage = `url("${background.url}")`
    }

    return (
      <section className={'pl-basic-layout ' + (className || '')} style={style}>
        <TopBar {...this.props} onSignOut={actions.clearIdentity} />
        <div className='pl-basic-layout__main'>
          <SideMenu />
          <div className='pl-basic-layout__main-contents'>
            {children}
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps (state) {
  // console.log('BasicLayout, state=', state)
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  const { userId } = state.settings.identity
  return {
    isAppLoaded: state.settings.isAppLoaded,
    user: state.users.data[userId],
    workspace: state.workspaces.data[workspaceId],
    activeTheme: state.settings.saved.activeTheme,
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
)(BasicLayout)
