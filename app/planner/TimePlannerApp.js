'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Moment from 'moment'

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

const PROJECTS_PER_PAGE = 5

class TimePlannerApp extends Component {
  constructor (props) {
    super(props)

    let pivotDate = this.props.savedPivotDate
    if (!pivotDate) {
      pivotDate = Moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
    }

    this.state = {
      page: 0,
      pivotDate
    }

    this.onChangePage = this.onChangePage.bind(this)
    this.onChangePivotDate = this.onChangePivotDate.bind(this)
  }

  onChangePivotDate (move) {
    let { pivotDate } = this.state
    const { actions } = this.props
    if (move > 0) {
      pivotDate = Moment(pivotDate).add(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
    } else {
      pivotDate = Moment(pivotDate).subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
    }
    this.setState({ pivotDate })
    actions.saveSettings({ pivotDate })
  }

  onChangePage (move) {
    const { projectsTotal } = this.props
    const pages = Math.floor(projectsTotal / PROJECTS_PER_PAGE)
    let page = this.state.page + move
    if (page < 0) {
      page = 0
    }
    if (page > pages) {
      page = pages
    }
    this.setState({ page })
  }

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
    const { projects, projectsTotal, actions } = this.props
    const { page, pivotDate } = this.state

    // Show max 5 or so projects at the same time.
    const start = page * PROJECTS_PER_PAGE
    const end = start + PROJECTS_PER_PAGE
    const projectIds = projects.slice(start, end)
    const pages = Math.floor(projectsTotal / PROJECTS_PER_PAGE)

    return (
      <section id='pl-time-planner-app' style={this.getThemeStyle()}>
        <TopNav />
        <ControlBar actions={actions}
          pivotDate={pivotDate}
          onChangePivotDate={this.onChangePivotDate} />
        <TimeBar pivotDate={pivotDate} showHours />
        <section className='pl-time-planner-rows'>
          {projectIds.map((x) => (
            <ProjectRow key={x} projectId={x} pivotDate={pivotDate} showHours />
          ))}
          <ProjectControlBar key='controlBar'
            actions={this.props.actions}
            projectsOnPage={projectIds.length}
            projectsTotal={projectsTotal}
            page={this.state.page}
            pages={pages}
            onChangePage={this.onChangePage}
          />
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
  return {
    savedPivotDate: state.settings.saved.pivotDate,
    user: state.users.data[userId],
    workspace: state.workspaces.data[workspaceId],
    projects: state.projects.order,
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
