'use strict'

import React, { Component } from 'react'

import './ControlBar.scss'

import FlipSwitch from './FlipSwitch'
import Button from './Button'

export default class ControlBar extends Component {
  render () {
    const { actions } = this.props
    return (
      <section className='pl-time-planner-control-bar'>
        <div className='pl-time-planner-control-bar__left'>
          <FlipSwitch left='Projects' right='Team' leftOn />
        </div>
        <div className='pl-time-planner-control-bar__right'>
          <Button onClick={actions.createAndEditProject}>
            <i className='fa fa-fw fa-plus' /> Create Project
          </Button>
          <FlipSwitch icons left='search-minus' right='search-plus' />
        </div>
      </section>
    )
  }
}

ControlBar.propTypes = {
  actions: React.PropTypes.object.isRequired
}
