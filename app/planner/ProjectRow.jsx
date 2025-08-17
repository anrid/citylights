'use strict'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import * as projectActions from '../actions/projectActions'
import * as shiftActions from '../actions/shiftActions'

import { projectsToShiftsMapSelector } from '../selectors/shifts'

import './ProjectRow.scss'

import ProjectMemberRow from './ProjectMemberRow'
import ShiftsRow from './ShiftsRow'
import Dropdown from '../components/widgets/Dropdown'
import Button from './Button'
import ConsultantsWidget from '../containers/ConsultantsWidget'
import ShiftHours from './ShiftHours'

function ProjectRow({ projectId, pivotDate, showHours }) {
  const dispatch = useDispatch()
  
  // Get data from Redux store
  const project = useSelector(state => state.projects.data[projectId])
  const usersData = useSelector(state => state.users.data)
  const members = project.members.map((x) => usersData[x])
  const shifts = useSelector(state => projectsToShiftsMapSelector(state)[project._id] || [])
  
  const userId = useSelector(state => state.settings.identity.userId)
  const isOwner = project.ownerId === userId
  const isAdmin = project.admins.find((x) => x === userId)
  const isOwnerOrAdmin = isOwner || isAdmin

  const [showMembersWidget, setShowMembersWidget] = useState(false)
  const [open, setOpen] = useState(false)

  // Create actions object
  const actions = {
    ...Object.keys(settingsActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(settingsActions[key](...args))
      return acc
    }, {}),
    ...Object.keys(projectActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(projectActions[key](...args))
      return acc
    }, {}),
    ...Object.keys(shiftActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(shiftActions[key](...args))
      return acc
    }, {})
  }

  const onActionMenuClick = useCallback((item) => {
    console.log('onActionMenuClick, item=', item)
    if (item._id === 'REMOVE_PROJECT') {
      actions.removeProject(project._id)
    }
  }, [actions, project])

  const onShowProperties = useCallback(() => {
    actions.showProjectProperties(project._id)
  }, [actions, project])

  const onToggleOpen = useCallback(() => {
    setOpen(prevOpen => !prevOpen)
  }, [])

  const onToggleMember = useCallback((userId) => {
    console.log('onToggleMember, userId=', userId)
    actions.toggleProjectMember(project._id, userId)
  }, [actions, project])

  const onToggleMembersWidget = useCallback(() => {
    setShowMembersWidget(prevShow => !prevShow)
  }, [])

  const renderProjectLabel = useCallback(() => {
    const colors = ['gray', 'amber', 'green', 'red', 'teal', 'blue', 'purple', 'brown']
    const color = colors[project.color]
    return (
      <div className={
        'pl-time-planner-project-row__label ' +
        'pl-time-planner-project-row__' + color
      } />
    )
  }, [project])

  const renderInnerRow = useCallback(() => {
    if (!open) {
      return null
    }

    const actionMenu = []
    if (isOwnerOrAdmin) {
      actionMenu.push({ _id: 'REMOVE_PROJECT', text: 'Delete Project' })
    }

    return (
      <div className='pl-time-planner-project-row__inner'>
        {renderProjectLabel()}
        <div className='pl-time-planner-project-row__inner__members'>
          {members.map((x) => {
            const memberShifts = shifts.filter((y) => y.assignee === x._id)
            // console.log('Filtering shifts=', shifts, 'by user=', x)
            return (
              <ProjectMemberRow key={x._id}
                project={project}
                member={x}
                shifts={memberShifts}
                pivotDate={pivotDate}
                actions={actions}
                showHours={showHours}
              />
            )
          })}
        </div>
        <div className='pl-time-planner-project-row__inner__options'>
          <Dropdown
            textOnly
            selected='Actions ..'
            items={actionMenu}
            onSelect={onActionMenuClick}
            closeOnSelect
          />
          <div className='pl-time-planner-project-row__assign'
            onClick={onToggleMembersWidget}>
            <Button>
              <i className='fa fa-fw fa-plus' /> Assign Person
            </Button>
            {showMembersWidget && (
              <ConsultantsWidget
                selected={members.map((x) => x._id)}
                onSelect={onToggleMember}
                onClose={onToggleMembersWidget}
              />
            )}
          </div>
        </div>
      </div>
    )
  }, [open, isOwnerOrAdmin, members, shifts, project, pivotDate, actions, showHours, showMembersWidget, onActionMenuClick, onToggleMembersWidget, onToggleMember, renderProjectLabel])

  const getStats = useCallback(() => {
    let _stats = []
    if (!project.noMembers && members.length) {
      _stats.push(members.length + ' ' + (members.length !== 1 ? 'members' : 'member'))
    }
    if (shifts.length) {
      _stats.push(shifts.length + ' ' + (shifts.length !== 1 ? 'shifts' : 'shift'))
    }
    return _stats.length ? _stats.join('. ') + '.' : null
  }, [project, members, shifts])

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
            {renderProjectLabel()}
            <div className='pl-time-planner-project-row__title'>
              <div className='pl-time-planner-project-row__title-text'>
                {project.title}
              </div>
              <div className='pl-time-planner-project-row__edit-project' onClick={onShowProperties}>
                edit
              </div>
            </div>
            <div className='pl-time-planner-project-row__stats'>
              {getStats()}
            </div>
          </div>
          <i className={angleCls} onClick={onToggleOpen} />
        </div>
        <div className='pl-time-planner-project-row__right'>
          {showHours && <ShiftHours project={project} members={members} shifts={shifts} pivotDate={pivotDate} actions={actions} showHours={showHours} />}
          <ShiftsRow project={project} members={members} shifts={shifts} pivotDate={pivotDate} actions={actions} preview />
        </div>
      </section>
      {renderInnerRow()}
    </section>
  )
}

ProjectRow.propTypes = {
  projectId: PropTypes.string.isRequired,
  pivotDate: PropTypes.any.isRequired,
  showHours: PropTypes.bool
}

export default ProjectRow
