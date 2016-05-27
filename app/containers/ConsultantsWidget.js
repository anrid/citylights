'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import { consultantItemsSelector } from '../selectors/users'

import WidgetPopup from '../components/WidgetPopup'
import InputWidget from '../components/InputWidget'

class ConsultantsWidget extends Component {
  constructor (props) {
    super(props)
    this.onSearch = this.onSearch.bind(this)
  }

  onSearch (query) {
    console.log('onSearch, query=', query)
    const { actions } = this.props
    actions.setSearchQuery({ consultantsInputWidget: query })
  }

  render () {
    return (
      <WidgetPopup {...this.props}>
        <InputWidget
          {...this.props}
          onSearch={this.onSearch}
        />
      </WidgetPopup>
    )
  }
}

function mapStateToProps (state, props) {
  // console.log('ConsultantsWidget, state=', state)
  return {
    items: consultantItemsSelector(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

const ConnectedConsultantsWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConsultantsWidget)

export default ConnectedConsultantsWidget
