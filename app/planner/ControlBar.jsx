'use strict'

import React from 'react'
import PropTypes from 'prop-types'

import './ControlBar.scss'

import FlipSwitch from './FlipSwitch'
import Pager from './Pager'
// import Button from './Button'

function ControlBar({ pivotDate, onChangePivotDate }) {
  return (
    <section className='pl-time-planner-control-bar'>
      <div className='pl-time-planner-control-bar__left'>
        <FlipSwitch left='Projects' right='Team' leftOn />
      </div>
      <div className='pl-time-planner-control-bar__right'>
        <FlipSwitch icons left='search-minus' right='search-plus' />
        <Pager selected={pivotDate} onChangePage={onChangePivotDate} />
      </div>
    </section>
  )
}

ControlBar.propTypes = {
  actions: PropTypes.object.isRequired,
  pivotDate: PropTypes.string.isRequired,
  onChangePivotDate: PropTypes.func.isRequired
}

export default ControlBar
