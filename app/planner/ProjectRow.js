'use strict'

import React, { Component } from 'react'
import Moment from 'moment'

import './ProjectRow.scss'

import GridOverlay from './GridOverlay'

export default class ProjectRow extends Component {
  render () {
    const { project } = this.props
    const startDate = Moment(this.props.pivotDate).startOf('isoWeek')
    const colors = ['gray', 'amber', 'green', 'red', 'teal', 'blue', 'purple', 'brown']
    const color = colors[project.color]

    let membersInfo = null
    if (!project.noMembers && project.members.length) {
      membersInfo = `${project.members.length} members.`
    }

    return (
      <section className='pl-time-planner-project-row'>
        <div className='pl-time-planner-project-row__left'>
          <div className='pl-time-planner-project-row__info'>
            <div className={
              'pl-time-planner-project-row__label ' +
              'pl-time-planner-project-row__' + color
            } />
            <div className='pl-time-planner-project-row__title'>
              {project.title}
            </div>
            <div className='pl-time-planner-project-row__stats'>
              {membersInfo}
            </div>
          </div>
          <i className='fa fa-angle-down' />
        </div>
        <div className='pl-time-planner-project-row__right'>
          <GridOverlay size={90} />
        </div>
      </section>
    )
  }
}

ProjectRow.propTypes = {
  project: React.PropTypes.object.isRequired,
  pivotDate: React.PropTypes.any.isRequired
}
