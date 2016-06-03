'use strict'

import React from 'react'

import './FlipSwitch.scss'

const FlipSwitch = ({ icons, leftOn, left, right }) => {
  const _left = icons ? <i className={'fa fa-fw fa-' + left} /> : left
  const _right = icons ? <i className={'fa fa-fw fa-' + right} /> : right

  const buttonCls = 'pl-time-planner-flip-switch__button ' +
    (leftOn ? 'pl-time-planner-flip-switch__on ' : '') +
    (icons ? 'pl-time-planner-flip-switch__icons ' : '')

  const leftCls = 'pl-time-planner-flip-switch__left ' + buttonCls
  const rightCls = 'pl-time-planner-flip-switch__right ' + buttonCls

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
