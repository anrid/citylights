'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Consultants.scss'

import * as settingsActions from '../actions/settingsActions'
import { getRoute } from '../selectors/routing'

import BasicLayout from './BasicLayout'
import ConsultantList from '../components/ConsultantList'
import ConsultantForm from './ConsultantForm'
import Loader from './Loader'

class Consultants extends Component {
  render () {
    const { route } = this.props
    return (
      <BasicLayout className='pl-consultants'>
        {route === '/consultants/add' && <ConsultantForm create />}
        {route === '/consultants' && <ConsultantList {...this.props} consultants={[]} />}
      </BasicLayout>
    )
  }
}

function mapStateToProps (state) {
  // console.log('Consultant state=', state)
  return {
    // TODO: Load workspace activity here.
    settings: state.settings,
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

const ConnectedConsultants = connect(
  mapStateToProps,
  mapDispatchToProps
)(Consultants)

const ConsultantsPage = () => (
  <Loader page={ConnectedConsultants} />
)

export default ConsultantsPage
