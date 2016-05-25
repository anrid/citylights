'use strict'

import React, { Component } from 'react'
import Moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Planning.scss'

import * as settingsActions from '../actions/settingsActions'
import { filteredConsultantsSelector } from '../selectors/users'

import BasicLayout from './BasicLayout'
import Loader from './Loader'

class Planning extends Component {
  render () {
    return (
      <BasicLayout className='pl-planning'>
        <PlanningBox {...this.props} />
      </BasicLayout>
    )
  }
}

const PlanningBox = (props) => (
  <section className='pl-planning-box'>
    <PlanningLeftColumn />
    <PlanningLeftAxis />
    <PlanningMainColumn {...props} />
  </section>
)

const PlanningLeftColumn = () => (
  <section className='pl-planning-left-column'>
    <div className='pl-planning-left-column__section'>
      Left column.
      <button>New Shift</button>
    </div>
  </section>
)

const PlanningLeftAxis = () => (
  <section className='pl-planning-left-axis'>
    <div className='pl-planning-left-axis__section'>
      Left axis.
    </div>
  </section>
)

const PlanningMainColumn = (props) => (
  <section className='pl-planning-main-column'>
    <PlanningTopAxis />
    <PlanningMainArea {...props} />
  </section>
)

const PlanningTopAxis = () => (
  <section className='pl-planning-top-axis'>
    <PlanningTopAxisMonth name='June 2016' />
  </section>
)

const PlanningTopAxisMonth = ({ name }) => {
  const dates = []
  for (let i = 0; i < 31; ++i) {
    dates.push(i + 1)
  }
  return (
    <div className='pl-planning-top-axis__month'>
      <div className='pl-planning-top-axis__month__name'>
        {name}
      </div>
      <div className='pl-planning-top-axis__month__dates'>
        {dates.map((x) => (
          <div className='pl-planning-cell' key={x}>{x}</div>
        ))}
      </div>
    </div>
  )
}

class PlanningShift extends Component {
  render () {
    const { startDate, endDate } = this.props.shift
    const { position, pivotDate, dayWidth, onClick } = this.props

    const start = Moment(startDate)
    const end = Moment(endDate)
    const pivot = Moment(pivotDate)

    const shiftDays = end.diff(start, 'days') || 1
    let daysFromPivot = start.diff(pivot, 'days')
    if (daysFromPivot < 0) {
      // TODO: Handle start dates before pivot date.
      daysFromPivot = 0
    }

    const style = {
      width: dayWidth * shiftDays,
      top: 40 * position,
      left: dayWidth * daysFromPivot
    }

    return (
      <div className='pl-planning-shift' style={style} onClick={onClick}>
      </div>
    )
  }
}

const PlanningMainArea = ({ shifts, actions }) => {
  const pivotDate = Moment('2016-06-01')
  const dayWidth = 22

  const getClickHandler = (shiftId) => () => actions.showShiftProperties(shiftId)

  return (
    <section className='pl-planning-main-area'>
      {shifts.map((x, i) => (
        <PlanningShift key={x._id} shift={x}
          dayWidth={dayWidth}
          position={i}
          pivotDate={pivotDate}
          onClick={getClickHandler(x._id)}
        />
      ))}
    </section>
  )
}

function mapStateToProps (state) {
  // console.log('Planning, state=', state)
  const shifts = state.shifts.order.map((x) => (
    state.shifts.data[x]
  ))
  return {
    shifts
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

const ConnectedPlanning = connect(
  mapStateToProps,
  mapDispatchToProps
)(Planning)

const PlanningPage = () => (
  <Loader page={ConnectedPlanning} />
)

export default PlanningPage
