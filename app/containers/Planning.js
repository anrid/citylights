'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Planning.scss'

import * as settingsActions from '../actions/settingsActions'
import { filteredConsultantsSelector } from '../selectors/users'

import { getRoute } from '../selectors/routing'

import BasicLayout from './BasicLayout'
import Loader from './Loader'

class Planning extends Component {
  render () {
    return (
      <BasicLayout className='pl-planning'>
        <PlanningBox />
      </BasicLayout>
    )
  }
}

const PlanningBox = ({ children }) => (
  <section className='pl-planning-box'>
    <PlanningLeftColumn />
    <PlanningLeftAxis />
    <PlanningMainColumn />
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

const PlanningMainColumn = () => (
  <section className='pl-planning-main-column'>
    <PlanningTopAxis />
    <PlanningMainArea />
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
        {dates.map((x) => <div key={x}>{x}</div>)}
      </div>
    </div>
  )
}

const PlanningMainArea = () => (
  <section className='pl-planning-main-area'>
    Main area.
  </section>
)

function mapStateToProps (state) {
  // console.log('Planning, state=', state)
  return {
    consultants: filteredConsultantsSelector(state),
    route: getRoute(state.routing)
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
