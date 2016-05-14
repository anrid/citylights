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
      <Dropdown selected={background.title} closeOnSelect onSelect={onSelect} items={items} />
    )
  }

  render () {
    return (
      <section className='pl-side-menu'>
        <div className='pl-side-menu__group'>
          <div className='pl-side-menu__row--active'><i className='fa fa-fw fa-home' /> Overview (Home)</div>
          <div className='pl-side-menu__row'><i className='fa fa-fw fa-briefcase' /> Clients</div>
          <div className='pl-side-menu__row'><i className='fa fa-fw fa-users' /> Consultants</div>
        </div>

        <div className='pl-side-menu__divider'/>

        <div className='pl-side-menu__group'>
          <div className='pl-side-menu__row'><i className='fa fa-fw fa-comment-o' /> Discuss</div>
          <div className='pl-side-menu__row'><i className='fa fa-fw fa-cog' /> Settings</div>
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
