'use strict'

import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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

function TimePlannerApp() {
  const dispatch = useDispatch()
  
  // Redux state
  const savedPivotDate = useSelector(state => state.settings.saved.pivotDate)
  const identity = useSelector(state => state.settings.identity)
  const users = useSelector(state => state.users.data)
  const workspaceId = useSelector(state => state.settings.saved.workspaceId)
  const workspace = useSelector(state => state.workspaces.data[workspaceId])
  const projects = useSelector(state => state.projects.order)
  const projectsTotal = useSelector(state => state.projects.order.length)
  const activeTheme = useSelector(state => state.settings.saved.activeTheme)
  const backgrounds = useSelector(state => state.settings.backgrounds)

  // Get current user - handle different identity structures
  let user = null
  if (identity) {
    if (identity.userId) {
      // Legacy structure: identity.userId points to users data
      user = users[identity.userId]
    } else if (identity._id) {
      // Direct user structure: identity contains user data
      user = identity
    }
  }

  const initialPivotDate = savedPivotDate || Moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
  
  const [page, setPage] = useState(0)
  const [pivotDate, setPivotDate] = useState(initialPivotDate)

  const onChangePivotDate = useCallback((move) => {
    let newPivotDate = pivotDate
    if (move > 0) {
      newPivotDate = Moment(pivotDate).add(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
    } else {
      newPivotDate = Moment(pivotDate).subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD')
    }
    setPivotDate(newPivotDate)
    dispatch(settingsActions.saveSettings({ pivotDate: newPivotDate }))
  }, [pivotDate, dispatch])

  const onChangePage = useCallback((move) => {
    const pages = Math.floor(projectsTotal / PROJECTS_PER_PAGE)
    let newPage = page + move
    if (newPage < 0) {
      newPage = 0
    }
    if (newPage > pages) {
      newPage = pages
    }
    setPage(newPage)
  }, [page, projectsTotal])

  const getThemeStyle = useCallback(() => {
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
  }, [backgrounds, activeTheme])

  // Create actions object
  const actions = {
    ...Object.keys(settingsActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(settingsActions[key](...args))
      return acc
    }, {}),
    ...Object.keys(projectActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(projectActions[key](...args))
      return acc
    }, {})
  }

  // Show max 5 or so projects at the same time.
  const start = page * PROJECTS_PER_PAGE
  const end = start + PROJECTS_PER_PAGE
  const projectIds = projects.slice(start, end)
  const pages = Math.floor(projectsTotal / PROJECTS_PER_PAGE)

  return (
    <section id='pl-time-planner-app' style={getThemeStyle()}>
      <TopNav />
      <ControlBar actions={actions}
        pivotDate={pivotDate}
        onChangePivotDate={onChangePivotDate} />
      <TimeBar pivotDate={pivotDate} showHours />
      <section className='pl-time-planner-rows'>
        {projectIds.map((x) => (
          <ProjectRow key={x} projectId={x} pivotDate={pivotDate} showHours />
        ))}
        <ProjectControlBar key='controlBar'
          actions={actions}
          projectsOnPage={projectIds.length}
          projectsTotal={projectsTotal}
          page={page}
          pages={pages}
          onChangePage={onChangePage}
        />
      </section>
      <PropertiesPanel />
    </section>
  )
}

const TimePlannerAppPage = () => (
  <Loader page={TimePlannerApp} />
)

export default TimePlannerAppPage
