'use strict'

import React, { Component } from 'react'

import './ProjectControlBar.scss'

import Button from './Button'

export default class ProjectControlBar extends Component {
  render () {
    const {
      actions,
      projectsOnPage,
      projectsTotal,
      page,
      pages,
      onChangePage
    } = this.props
    return (
      <div className='pl-time-planner-project-control-bar'>
        <Button onClick={actions.createAndEditProject}>
          <i className='fa fa-fw fa-plus' /> Create a new Project
        </Button>
        <div className='pl-time-planner-project-control-bar__text'>
          Showing {projectsOnPage} / {projectsTotal} projects.
        </div>
        <div className='pl-time-planner-project-control-bar__text'>
          {page !== 0 && <i className='fa fa-fw fa-angle-left' onClick={() => onChangePage(-1)}/>}
          Page {page + 1} of {pages + 1}
          {page !== pages && <i className='fa fa-fw fa-angle-right' onClick={() => onChangePage(1)}/>}
        </div>
      </div>
    )
  }
}
