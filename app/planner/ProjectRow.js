'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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

class ProjectRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showMembersWidget: false,
      open: false
    }
    this.onToggleOpen = this.onToggleOpen.bind(this)
    this.onToggleMember = this.onToggleMember.bind(this)
    this.onToggleMembersWidget = this.onToggleMembersWidget.bind(this)
    this.onShowProperties = this.onShowProperties.bind(this)
    this.onActionMenuClick = this.onActionMenuClick.bind(this)
  }

  onActionMenuClick (item) {
    console.log('onActionMenuClick, item=', item)
    const { project, actions } = this.props
    if (item._id === 'REMOVE_PROJECT') {
      actions.removeProject(project._id)
    }
  }

  onShowProperties () {
    const { project, actions } = this.props
    actions.showProjectProperties(project._id)
  }

  onToggleOpen () {
    this.setState({ open: !this.state.open })
  }

  onToggleMember (userId) {
    console.log('onToggleMember, userId=', userId)
    const { project, actions } = this.props
    actions.toggleProjectMember(project._id, userId)
  }

  onToggleMembersWidget () {
    this.setState({
      showMembersWidget: !this.state.showMembersWidget
    })
  }

  renderInnerRow () {
    const { open, showMembersWidget } = this.state
    if (!open) {
      return null
    }
    const {
      project,
      shifts,
      members,
      pivotDate,
      actions,
      isOwnerOrAdmin
    } = this.props

    const actionMenu = []
    if (isOwnerOrAdmin) {
      actionMenu.push({ _id: 'REMOVE_PROJECT', text: 'Delete Project' })
    }

    return (
      <div className='pl-time-planner-project-row__inner'>
        {this.renderProjectLabel()}
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
              />
            )
          })}
        </div>
        <div className='pl-time-planner-project-row__inner__options'>
          <Dropdown
            textOnly
            selected='Actions ..'
            items={actionMenu}
            onSelect={this.onActionMenuClick}
            closeOnSelect
          />
          <div className='pl-time-planner-project-row__assign'
            onClick={this.onToggleMembersWidget}>
            <Button>
              <i className='fa fa-fw fa-plus' /> Assign Person
            </Button>
            {showMembersWidget && (
              <ConsultantsWidget
                selected={members.map((x) => x._id)}
                onSelect={this.onToggleMember}
                onClose={this.onToggleMembersWidget}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  renderProjectLabel () {
    const { project } = this.props
    const colors = ['gray', 'amber', 'green', 'red', 'teal', 'blue', 'purple', 'brown']
    const color = colors[project.color]
    return (
      <div className={
        'pl-time-planner-project-row__label ' +
        'pl-time-planner-project-row__' + color
      } />
    )
  }

  getStats () {
    const { project, members, shifts } = this.props
    let _stats = []
    if (!project.noMembers && members.length) {
      _stats.push(members.length + ' ' + (members.length !== 1 ? 'members' : 'member'))
    }
    if (shifts.length) {
      _stats.push(shifts.length + ' ' + (shifts.length !== 1 ? 'shifts' : 'shift'))
    }
    return _stats.length ? _stats.join('. ') + '.' : null
  }

  render () {
    const { project } = this.props
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
              {this.renderProjectLabel()}
              <div className='pl-time-planner-project-row__title'>
                <div className='pl-time-planner-project-row__title-text'>
                  {project.title}
                </div>
                <div className='pl-time-planner-project-row__edit-project' onClick={this.onShowProperties}>
                  edit
                </div>
              </div>
              <div className='pl-time-planner-project-row__stats'>
                {this.getStats()}
              </div>
            </div>
            <i className={angleCls} onClick={this.onToggleOpen} />
          </div>
          <div className='pl-time-planner-project-row__right'>
            <ShiftsRow {...this.props} preview />
          </div>
        </section>
        {this.renderInnerRow()}
      </section>
    )
  }
}

ProjectRow.propTypes = {
  project: React.PropTypes.object.isRequired,
  members: React.PropTypes.array.isRequired,
  shifts: React.PropTypes.array.isRequired,
  pivotDate: React.PropTypes.any.isRequired
}

function mapStateToProps (state, { projectId }) {
  const project = state.projects.data[projectId]
  let members = project.members.map((x) => state.users.data[x])
  const shifts = projectsToShiftsMapSelector(state)[project._id] || []

  const userId = state.settings.identity.userId
  const isOwner = project.ownerId === userId
  const isAdmin = project.admins.find((x) => x === userId)

  return {
    project,
    members,
    shifts,
    usersMap: state.users.data,
    isOwnerOrAdmin: isOwner || isAdmin
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions,
      ...projectActions,
      ...shiftActions
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectRow)
