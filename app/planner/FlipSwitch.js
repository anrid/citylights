'use strict'

import React from 'react'
import classnames from 'classnames'

import './FlipSwitch.scss'

const FlipSwitch = ({ icons, leftOn, left, right }) => {
  const _left = icons ? <i className={'fa fa-fw fa-' + left} /> : left
  const _right = icons ? <i className={'fa fa-fw fa-' + right} /> : right

  const leftCls = classnames({
    'pl-time-planner-flip-switch__left': true,
    'pl-time-planner-flip-switch__button': true,
    'pl-time-planner-flip-switch__on': leftOn,
    'pl-time-planner-flip-switch__icons': icons
  })

  const rightCls = classnames({
    'pl-time-planner-flip-switch__right': true,
    'pl-time-planner-flip-switch__button': true,
    'pl-time-planner-flip-switch__on': !leftOn,
    'pl-time-planner-flip-switch__icons': icons
  })

  return (
    <div className='pl-time-planner-flip-switch'>
      <div key={1} className={leftCls}>
        {_left}
      </div>
      <div key={2} className={rightCls}>
        {_right}
      </div>
    </div>
  )
}

export default FlipSwitch
