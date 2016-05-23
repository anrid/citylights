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

import BasicLayout from './BasicLayout'

// Various components we wish to rende
import InputWidget from '../components/InputWidget'
import Loader from './Loader'

class ComponentBuilder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isReloading: false
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

  renderComponents (isReloading) {
    if (isReloading) {
      return <Comment>Reloading all the things ..</Comment>
    }

    // Render all the things !
    const inputWidgetItems = [
      { _id: 1, text: 'ace' }
    ]

    return (
      <div className='pl-component-builder__components'>

        <Comment>Standard input widget.</Comment>
        <InputWidget items={inputWidgetItems} />

        <Comment>Standard input widget with opening animation.</Comment>
        <InputWidget items={inputWidgetItems} animate />

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
        {this.renderComponents(isReloading)}
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
