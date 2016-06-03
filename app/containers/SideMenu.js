'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './SideMenu.scss'

import * as settingsActions from '../actions/settingsActions'
import Dropdown from '../components/Dropdown'

class SideMenu extends Component {
  renderThemePicker () {
    const { actions, backgrounds, activeTheme } = this.props
    const background = backgrounds[activeTheme || 'BG4']

    function onSelect (item) {
      actions.saveSettings({ activeTheme: item._id })
    }

    const availableThemes = ['BG2', 'BG3', 'BG4', 'BG5', 'BG6', 'BG7', 'BG8']
    const items = availableThemes.map((x) => {
      const bg = backgrounds[x]
      return { _id: bg._id, text: bg.title }
    })

    return (
      <Dropdown selected={background.title} onSelect={onSelect} items={items} />
    )
  }

  // NOTE: How React truly shines ...
  renderMenuItem (title, icon, routeName, currentRoute) {
    const { routeTo } = this.props.actions
    let cls = 'pl-side-menu__row'
    let arrow = null
    if (currentRoute.indexOf(routeName) === 0) {
      cls += '--active'
      arrow = <i className='fa fa-fw fa-caret-right' />
    }

    return (
      <div className={cls} onClick={() => routeTo(routeName)}>
        <i className={'fa fa-fw fa-' + icon} />
        <div className='pl-side-menu__row-inner'>
          <span>{title}</span>
          {arrow}
        </div>
      </div>
    )
  }

  render () {
    const { routing } = this.props
    // Default to 'overview'
    let currentRoute = '/overview'
    if (routing && routing.locationBeforeTransitions) {
      currentRoute = routing.locationBeforeTransitions.pathname
    }

    return (
      <section className='pl-side-menu'>
        <div className='pl-side-menu__group'>
          {this.renderMenuItem('Overview', 'home', '/overview', currentRoute)}
          {this.renderMenuItem('Consultants', 'users', '/consultants', currentRoute)}
          {this.renderMenuItem('Time Planner ∀', 'paper-plane', '/time', currentRoute)}
          {this.renderMenuItem('Quick Planner', 'paper-plane-o', '/planning', currentRoute)}
        </div>

        <div className='pl-side-menu__divider'/>

        <div className='pl-side-menu__group'>
          {this.renderMenuItem('Discuss', 'comment-o', '/discuss', currentRoute)}
          {this.renderMenuItem('Settings', 'cog', '/settings', currentRoute)}
          <div className='pl-side-menu__row nope'><i className='fa fa-fw fa-hand-peace-o' />
            {this.renderThemePicker()}
          </div>
        </div>

      </section>
    )
  }
}

function mapStateToProps (state) {
  // Currently active workspaceId.
  // const { workspaceId } = state.settings.saved
  return {
    routing: state.routing,
    isLoadingData: state.settings.isLoadingData,
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
)(SideMenu)
