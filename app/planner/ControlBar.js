'use strict'

import React, { Component } from 'react'

import './ControlBar.scss'

import FlipSwitch from './FlipSwitch'

export default class ControlBar extends Component {
  render () {
    return (
      <section className='pl-time-planner-control-bar'>
        <div className='pl-time-planner-control-bar__left'>
          <FlipSwitch left='Projects' right='Team' leftOn />
        </div>
        <div className='pl-time-planner-control-bar__right'>
          <FlipSwitch icons left='search-minus' right='search-plus' />
        </div>
      </section>
    )
  }
}
