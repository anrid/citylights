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
    const { projects } = this.props
    const pivotDate = '2016-06-01'
    return (
      <section id='pl-time-planner-app' style={this.getThemeStyle()}>
        <TopNav />
        <ControlBar />
        <TimeBar pivotDate={pivotDate} />
        <section className='pl-time-planner-rows'>
          {projects.map((x) => <ProjectRow key={x} projectId={x} pivotDate={pivotDate} />)}
        </section>
      </section>
    )
  }
}

function mapStateToProps (state) {
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  const { userId } = state.settings.identity
  const projects = state.projects.order
  return {
    user: state.users.data[userId],
    workspace: state.workspaces.data[workspaceId],
    projects,
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
