'use strict'

import React, { Component } from 'react'
import Moment from 'moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Planning.scss'

import * as settingsActions from '../actions/settingsActions'
import * as shiftActions from '../actions/shiftActions'

import BasicLayout from './BasicLayout'
import Loader from './Loader'
import PlanningShift from '../components/PlanningShift'

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
    <PlanningLeftColumn {...props} />
    <PlanningMainColumn {...props} />
  </section>
)

const PlanningLeftColumn = ({ shifts, actions }) => {
  return (
    <section className='pl-planning-left-column'>
      <div className='pl-planning-header'>
        Shifts
      </div>
      <div className='pl-planning-left-column__search-box'>
        <div className='pl-form__input'>
          <input type='text'
            placeholder='Search for shifts'
          />
        </div>
      </div>
      <div className='pl-planning-left-column__buttons'>
        <button className='pl-form-button'>
          <i className='fa fa-plus' />
          Add Shift
        </button>
      </div>
    </section>
  )
}

const PlanningMainColumn = (props) => (
  <section className='pl-planning-main-column'>
    <PlanningTopAxis {...props} />
    <PlanningMainArea {...props} />
  </section>
)

const PlanningTopAxis = (props) => {
  const cls = props.overlay ? 'pl-planning-top-axis--overlay' : ''
  return (
    <section className={'pl-planning-top-axis ' + cls}>
      <PlanningTopAxisMonth month='2016-06' {...props} />
      <PlanningTopAxisMonth month='2016-07' {...props} />
    </section>
  )
}

const PlanningTopAxisMonth = ({ month, shifts, actions }) => {
  const _month = Moment(month, 'YYYY-MM')
  const daysInMonth = _month.daysInMonth()

  const dates = []
  const weekdays = []
  for (let i = 0; i < daysInMonth; ++i) {
    dates.push(i + 1)
    if (weekdays.length < 7) {
      weekdays.push(_month.clone().add(i, 'day').format('dd'))
    }
  }
  const addNewShift = (date) => {
    const startDate = _month.clone().add(date - 1, 'days').format()
    console.log('Adding a shift starting:', startDate)
    actions.createShift(startDate)
  }

  const cellStyle = {
    minHeight: 200 + (shifts.length * 44)
  }

  return (
    <div className='pl-planning-top-axis__month'>
      <div className='pl-planning-top-axis__month__name'>
        {_month.format('MMMM YYYY')}
      </div>
      <div className='pl-planning-top-axis__month__dates'>
        {dates.map((x) => {
          const weekday = weekdays[(x - 1) % 7]
          const cls = weekday === 'Mo' ? 'pl-planning-cell__week-start' : ''
          return (
            <div className={'pl-planning-cell ' + cls}
              key={x}
              style={cellStyle}
              onClick={() => addNewShift(x)}
            >
              <div className='pl-planning-cell__date'>{x}</div>

              <div className='pl-planning-cell__day-of-week'>
                {weekdays[(x - 1) % 7]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PlanningMainArea = (props) => {
  const { shifts, users, actions } = props
  const pivotDate = Moment('2016-06-01')
  const dayWidth = 22

  const getClickHandler = (shiftId) => () => actions.showShiftProperties(shiftId)

  return (
    <section className='pl-planning-main-area'>
      <div className='pl-planning-main-area__inner'>
        {shifts.map((x, i) => (
          <PlanningShift key={x._id}
            shift={x}
            users={users}
            dayWidth={dayWidth}
            position={i}
            pivotDate={pivotDate}
            onClick={getClickHandler(x._id)}
            updateShiftAction={actions.updateShift}
          />
        ))}
      </div>
    </section>
  )
}

function mapStateToProps (state) {
  // console.log('Planning, state=', state)
  const shifts = state.shifts.order.map((x) => state.shifts.data[x])
  return {
    users: state.users.data,
    shifts
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...shiftActions,
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
