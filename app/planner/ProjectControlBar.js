'use strict'

import React, { Component } from 'react'

import './ProjectControlBar.scss'

import Button from './Button'

export default class ProjectControlBar extends Component {
  render () {
    const { actions, projects, projectsTotal } = this.props
    return (
      <div className='pl-time-planner-project-control-bar'>
        <Button onClick={actions.createAndEditProject}>
          <i className='fa fa-fw fa-plus' /> Create a new Project
        </Button>
        <div className='pl-time-planner-project-control-bar__text'>
          Showing {projects.length} / {projectsTotal} projects.
        </div>
      </div>
    )
  }
}
