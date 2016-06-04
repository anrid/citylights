'use strict'
/*
 * Component builder is used to render components in their various states,
 * to simplify development.
 */

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import './ComponentBuilder.scss'

import * as settingsActions from '../actions/settingsActions'
import { consultantItemsSelector } from '../selectors/users'

import BasicLayout from './BasicLayout'

// Various components we wish to rende
import InputWidget from '../components/widgets/InputWidget'
import Loader from './Loader'

class ComponentBuilder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isReloading: false,
      inputWidget: {
        usersSelected: []
      }
    }
  }

  componentDidUpdate () {
    if (this.state.isReloading) {
      console.log('Reloading in 250 ms.')
      setTimeout(() => {
        console.log('Updated !')
        this.setState({ isReloading: false })
      }, 250)
    }
  }

  renderComponents () {
    const { isReloading } = this.state
    if (isReloading) {
      return <Comment>Reloading all the things ..</Comment>
    }

    return (
      <div className='pl-component-builder__components'>
        {this.renderInputWidget()}
      </div>
    )
  }

  renderInputWidget () {
    const { actions } = this.props

    // Render all the things !
    const inputWidgetItems = [
      { _id: 1, text: 'Ace', photo: null },
      { _id: 2, text: 'Base', photo: null },
      { _id: 3, text: 'Chase', photo: null }
    ]
    const selected = [3]

    const onSearch = (query) => {
      actions.setSearchQuery({ consultantsInputWidget: query })
    }

    const onSelectDoNothing = (id, type) => {
      console.log('onSelect, id=', id, 'type=', type)
    }

    const onSelectUser = (id, type) => {
      console.log('onSelectUser, id=', id, 'type=', type)
      const { inputWidget } = this.state
      let selected = (inputWidget.usersSelected || [])
      if (selected.find((x) => x === id)) {
        selected = selected.filter((x) => x !== id)
      } else {
        selected = selected.concat(id)
      }
      const updated = Object.assign({ }, inputWidget, { usersSelected: selected })
      this.setState({ inputWidget: updated })
    }

    return (
      <div>
        <Comment>Standard input widget.</Comment>
        <InputWidget items={inputWidgetItems} onSearch={onSearch}
          selected={selected} onSelect={onSelectDoNothing} />

        <Comment>Standard input widget with opening animation, showing all consultants.</Comment>
        <InputWidget
          items={this.props.consultantItems}
          selected={this.state.inputWidget.usersSelected}
          animate
          onSearch={onSearch}
          onSelect={onSelectUser}
        />
      </div>
    )
  }

  render () {
    const { isReloading } = this.state
    return (
      <BasicLayout className='pl-component-builder'>
        <Comment>Developer Panel:</Comment>
        <button onClick={() => this.setState({ isReloading: true })}>
          {isReloading ? <i className='fa fa-cog fa-spin' /> : 'Refresh All'}
        </button>
        {this.renderComponents()}
      </BasicLayout>
    )
  }
}

const Comment = ({ children }) => (
  <div className='pl-component-builder__comment'>
    {children}
  </div>
)

function mapStateToProps (state) {
  return {
    consultantItems: consultantItemsSelector(state),
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

const ConnectedComponentBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComponentBuilder)

const ComponentBuilderPage = () => (
  <Loader page={ConnectedComponentBuilder} />
)

export default ComponentBuilderPage
