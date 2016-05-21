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
      activeTheme,
      className,
      actions,
      children
    } = this.props

    let cls = className || ''
    // Select the theme background.
    const background = backgrounds[activeTheme || 'BG4']
    const style = { }
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
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  const { userId } = state.settings.identity
  const workspaceList = state.workspaces.order.map((x) => (
    state.workspaces.data[x]
  ))
  return {
    user: state.users.data[userId],
    workspace: state.workspaces.data[workspaceId],
    workspaceList,
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
