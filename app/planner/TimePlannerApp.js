'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import * as projectActions from '../actions/projectActions'

import './TimePlannerApp.scss'

import Loader from '../containers/Loader'
import TopNav from './TopNav'
import ControlBar from './ControlBar'
import TimeBar from './TimeBar'
import ProjectRow from './ProjectRow'
import PropertiesPanel from '../containers/PropertiesPanel'
import ProjectControlBar from './ProjectControlBar'

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
        <ControlBar {...this.props} />
        <TimeBar pivotDate={pivotDate} />
        <section className='pl-time-planner-rows'>
          {projects.map((x) => <ProjectRow key={x} projectId={x} pivotDate={pivotDate} />)}
          <ProjectControlBar key='controlBar' {...this.props} />
        </section>
        <PropertiesPanel />
      </section>
    )
  }
}

function mapStateToProps (state) {
  // Currently active workspaceId.
  const { workspaceId } = state.settings.saved
  const { userId } = state.settings.identity

  // Show max 5 projects at the same time.
  const projects = state.projects.order.slice(0, 5)

  return {
    user: state.users.data[userId],
    workspace: state.workspaces.data[workspaceId],
    projects,
    projectsTotal: state.projects.order.length,
    activeTheme: state.settings.saved.activeTheme,
    backgrounds: state.settings.backgrounds
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions,
      ...projectActions
    }, dispatch)
  }
}

const ConnectedTimePlannerApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimePlannerApp)

const TimePlannerAppPage = () => (
  <Loader page={ConnectedTimePlannerApp} />
)

export default TimePlannerAppPage
