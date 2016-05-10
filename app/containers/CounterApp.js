'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Counter from '../components/Counter'
import * as counterActions from '../actions/counterActions'
import * as settingsActions from '../actions/settingsActions'

class CounterApp extends Component {
  render () {
    const { state, actions } = this.props
    return (
      <Counter
        counter={state.count}
        {...actions}
      />
    )
  }
}

function mapStateToProps (state) {
  console.log('CounterApp: state=', state)
  return {
    state: state.counter
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...counterActions,
      ...settingsActions
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterApp)
