'use strict'

import React, { Component } from 'react'

import './ProjectMemberRow.scss'

import ShiftsRow from './ShiftsRow'
import ShiftHours from './ShiftHours'

export default class ProjectMemberRow extends Component {
  constructor (props) {
    super(props)
    this.onCreateShift = this.onCreateShift.bind(this)
  }

  onCreateShift (startDate) {
    console.log('onCreateShift, startDate=', startDate)
    const { project, member, actions } = this.props
    actions.createShift(project._id, member._id, startDate, project.color)
  }

  render () {
    const { member, actions, showHours } = this.props
    let name = member.email
    if (member.firstName || member.lastName) {
      name = `${member.firstName} ${member.lastName}`
    }
    return (
      <section className='pl-time-planner-project-member-row'>
        <div className='pl-time-planner-project-member-row__left'>
          <div className='pl-time-planner-project-member-row__info'>
            <div className='pl-time-planner-project-member-row__name'>
              {name}
            </div>
            <div className='pl-time-planner-project-member-row__stats'>
              {member.profile.title}
            </div>
          </div>
          <div className='pl-time-planner-project-member-row__photo'
            onClick={() => actions.showConsultantProperties(member._id)}
            style={{backgroundImage: `url(${member.profile.photo})`}} />
        </div>
        <div className='pl-time-planner-project-member-row__right'>
          {showHours && <ShiftHours {...this.props} />}
          <ShiftsRow {...this.props} onCreateShift={this.onCreateShift} />
        </div>
      </section>
    )
  }
}

ProjectMemberRow.propTypes = {
  project: React.PropTypes.object.isRequired,
  member: React.PropTypes.object.isRequired,
  shifts: React.PropTypes.array.isRequired,
  pivotDate: React.PropTypes.any.isRequired,
  actions: React.PropTypes.object.isRequired,
  showHours: React.PropTypes.bool
}
