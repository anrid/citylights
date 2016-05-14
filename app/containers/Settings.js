'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './Settings.scss'

import * as settingsActions from '../actions/settingsActions'

import BasicLayout from './BasicLayout'

class Settings extends Component {
  render () {
    return (
      <BasicLayout className='pl-settings'>
        <h1>Form!</h1>
      </BasicLayout>
    )
  }
}

function mapStateToProps (state) {
  return {
    // TODO: Load workspace activity here.
    settings: state.settings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
