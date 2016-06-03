'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'

import './TimePlannerApp.scss'

import TopNav from './TopNav'
import ControlBar from './ControlBar'
import TimeBar from './TimeBar'
import ProjectRow from './ProjectRow'

class TimePlannerApp extends Component {
  getThemeStyle () {
    const { backgrounds, activeTheme } = this.props
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
    }
    return style
  }

  render () {
    const projects = [
      { _id: 'PROJ1', title: 'Time Off', members: [], color: 0, noMembers: true },
      { _id: 'PROJ2', title: 'My Awesome Project', members: ['USER1', 'USER2'], color: 1 },
      { _id: 'PROJ3', title: 'Blazing Webapp !', members: [], color: 2 },
      { _id: 'PROJ4', title: 'Support Team', members: [], color: 3 },
      { _id: 'PROJ5', title: 'New Marketing Website — Phase 1', members: [], color: 5 },
      { _id: 'PROJ6', title: 'New Marketing Website — Phase 2', members: [], color: 5 }
    ]
    const pivotDate = '2016-06-01'

    return (
      <section id='pl-time-planner-app' style={this.getThemeStyle()}>
        <TopNav />
        <ControlBar />
        <TimeBar pivotDate={pivotDate} />
        <section className='pl-time-planner-rows'>
          {projects.map((x) => <ProjectRow key={x._id} project={x} pivotDate={pivotDate} />)}
        </section>
      </section>
    )
  }
}

function mapStateToProps (state) {
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  const { userId } = state.settings.identity
  return {
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
)(TimePlannerApp)
