'use strict'

import React, { Component } from 'react'
import Moment from 'moment'

import './ProjectRow.scss'

import GridOverlay from './GridOverlay'

export default class ProjectRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.toggleOpen = this.toggleOpen.bind(this)
  }

  toggleOpen () {
    this.setState({ open: !this.state.open })
  }

  render () {
    const { project } = this.props
    const startDate = Moment(this.props.pivotDate).startOf('isoWeek')
    const colors = ['gray', 'amber', 'green', 'red', 'teal', 'blue', 'purple', 'brown']
    const color = colors[project.color]

    let membersInfo = null
    if (!project.noMembers && project.members.length) {
      membersInfo = `${project.members.length} members.`
    }

    const { open } = this.state
    let rowCls = 'pl-time-planner-project-row-wrapper '
    let angleCls = 'fa fa-angle-down'
    if (open) {
      rowCls += 'pl-time-planner-project-row-wrapper--open'
      angleCls = 'fa fa-angle-up'
    }

    return (
      <section className={rowCls}>
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
            <i className={angleCls} onClick={this.toggleOpen} />
          </div>
          <div className='pl-time-planner-project-row__right'>
            <GridOverlay size={90} />
          </div>
        </section>
      </section>
    )
  }
}

ProjectRow.propTypes = {
  project: React.PropTypes.object.isRequired,
  pivotDate: React.PropTypes.any.isRequired
}
