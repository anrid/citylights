'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import './ProjectControlBar.scss'

import Button from './Button'

function ProjectControlBar({
  actions,
  projectsOnPage,
  projectsTotal,
  page,
  pages,
  onChangePage
}) {
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

ProjectControlBar.propTypes = {
  actions: PropTypes.object.isRequired,
  projectsOnPage: PropTypes.number.isRequired,
  projectsTotal: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired
}

export default ProjectControlBar
