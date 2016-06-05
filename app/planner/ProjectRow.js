'use strict'

import React, { Component } from 'react'
import Moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import * as projectActions from '../actions/projectActions'

import './ProjectRow.scss'

import GridOverlay from './GridOverlay'
import ProjectMemberRow from './ProjectMemberRow'
import DropdownButton from './DropdownButton'
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
    const { members, pivotDate } = this.props
    return (
      <div className='pl-time-planner-project-row__inner'>
        {this.renderProjectLabel()}
        <div className='pl-time-planner-project-row__inner__members'>
          {members.map((x) => (
            <ProjectMemberRow key={x._id} member={x} shifts={[]} pivotDate={pivotDate} />
          ))}
        </div>
        <div className='pl-time-planner-project-row__inner__options'>
          <DropdownButton action selected='Actions ..' items={[]} />
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

  render () {
    const { project, members } = this.props
    const startDate = Moment(this.props.pivotDate).startOf('isoWeek')

    let membersInfo = null
    if (!project.noMembers && members.length) {
      membersInfo = `${members.length} members.`
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
                {membersInfo}
              </div>
            </div>
            <i className={angleCls} onClick={this.onToggleOpen} />
          </div>
          <div className='pl-time-planner-project-row__right'>
            <GridOverlay size={90} />
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
  pivotDate: React.PropTypes.any.isRequired
}

function mapStateToProps (state, { projectId }) {
  const project = state.projects.data[projectId]
  let members = project.members.map((x) => state.users.data[x])
  // TODO: Used in Development mode only. Remove later !
  // if (project._id === 'PROJ3') {
  //   members = state.users.order.slice(1, 3).map((x) => state.users.data[x])
  // }
  return {
    project,
    members
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions,
      ...projectActions
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectRow)
