'use strict'

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './PropertiesPanel.scss'

import * as settingsActions from '../actions/settingsActions'
import { getRoute } from '../selectors/routing'

import Dropdown from '../components/Dropdown'

class PropertiesPanel extends Component {
  renderDropdown () {
    const menuItems = [
      { _id: 1, text: 'Action #1' },
      { _id: 2, text: 'Action #2' }
    ]

    return (
      <Dropdown
        closeOnSelect
        items={menuItems}
        caretOnly
        onSelect={this.onSelect}
      />
    )
  }

  render () {
    const { route } = this.props
    return (
      <section className='pl-properties-panel'>
        <section className='pl-box'>
          <div className='pl-box__header'>
            <div>Properties</div>
            {this.renderDropdown()}
          </div>
          <div className='pl-box__content'>
            Hello ! {route}
          </div>
        </section>
      </section>
    )
  }
}

function mapStateToProps (state) {
  console.log('PropertiesPanel, state=', state)
  return {
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

const ConnectedPropertiesPanel = connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesPanel)

export default ConnectedPropertiesPanel
