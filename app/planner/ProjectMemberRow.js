'use strict'

import React, { Component } from 'react'

import './ProjectMemberRow.scss'

import ShiftsRow from './ShiftsRow'

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
    const { member, actions } = this.props
    return (
      <section className='pl-time-planner-project-member-row'>
        <div className='pl-time-planner-project-member-row__left'>
          <div className='pl-time-planner-project-member-row__info'>
            <div className='pl-time-planner-project-member-row__name'>
              {member.firstName} {member.lastName}
            </div>
            <div className='pl-time-planner-project-member-row__stats'>
              {member.profile.title}
            </div>
          </div>
          <div className='pl-time-planner-project-member-row__photo'
            onClick={() => actions.showConsultantProperties(member._id)}
            style={{backgroundImage: `url(${member.photo})`}} />
        </div>
        <div className='pl-time-planner-project-member-row__right'>
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
  actions: React.PropTypes.object.isRequired
}
