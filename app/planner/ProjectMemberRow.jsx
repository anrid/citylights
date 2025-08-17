'use strict'

import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import './ProjectMemberRow.scss'

import ShiftsRow from './ShiftsRow'
import ShiftHours from './ShiftHours'

function ProjectMemberRow(props) {
  const { member, actions, showHours, project } = props

  const onCreateShift = useCallback((startDate) => {
    console.log('onCreateShift, startDate=', startDate)
    actions.createShift(project._id, member._id, startDate, project.color)
  }, [project._id, member._id, project.color, actions])

  const name = useMemo(() => {
    if (member.firstName || member.lastName) {
      return `${member.firstName} ${member.lastName}`
    }
    return member.email
  }, [member.firstName, member.lastName, member.email])

  return (
    <section className='pl-time-planner-project-member-row'>
      <div className='pl-time-planner-project-member-row__left'>
        <div className='pl-time-planner-project-member-row__photo'
          onClick={() => actions.showConsultantProperties(member._id)}
          style={{backgroundImage: `url(${member.profile.photo})`}} />
        <div className='pl-time-planner-project-member-row__info'>
          <div className='pl-time-planner-project-member-row__name'>
            {name}
          </div>
          <div className='pl-time-planner-project-member-row__stats'>
            {member.profile.title}
          </div>
        </div>
      </div>
      <div className='pl-time-planner-project-member-row__right'>
        {showHours && <ShiftHours {...props} />}
        <ShiftsRow {...props} onCreateShift={onCreateShift} />
      </div>
    </section>
  )
}

ProjectMemberRow.propTypes = {
  project: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired,
  shifts: PropTypes.array.isRequired,
  pivotDate: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired,
  showHours: PropTypes.bool
}

export default ProjectMemberRow
