'use strict'

import React from 'react'

import './ActivityFeed.scss'

import Dropdown from './widgets/Dropdown'

function ActivityFeed({ activity }) {
  const onSelect = (command) => {
    console.log('TODO: Implement this:', command)
  }

  let content
  if (!activity || !activity.length) {
    content = (
      <div>Nothing clean, right ..</div>
    )
  } else {
    content = activity.map((x, i) => (
      <ActivityRow key={x._id} {...x} />
    ))
  }

  const menuItems = [
    { _id: 1, text: 'Dismiss All' }
  ]

  return (
    <section className='pl-box pl-activity-feed'>
      <div className='pl-box__header'>
        <div>Activity</div>
        <Dropdown
          closeOnSelect
          items={menuItems}
          caretOnly
          onSelect={onSelect}
        />
      </div>
      <div className='pl-box__content'>
        <div className='pl-activity-feed__rows'>
          {content}
        </div>
      </div>
    </section>
  )
}

export default ActivityFeed

const ActivityRow = (props) => {
  return (
    <div className='pl-activity-feed__row-wrapper'>
      <div className='pl-activity-feed__row'>
        <div className='pl-activity-feed__row-label' />
        <div className='pl-activity-feed__row-text'>{props.text}</div>
      </div>
    </div>
  )
}
