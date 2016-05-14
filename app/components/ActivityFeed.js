'use strict'

import React, { Component } from 'react'

import './ActivityFeed.scss'

import Dropdown from './Dropdown'

export default class ActivityFeed extends Component {
  renderActivityRows () {
    const { activity } = this.props
    if (!activity || !activity.length) {
      return <div>Nothing clean, right ..</div>
    }

    return activity.map((x, i) => (
      <ActivityRow key={x._id} {...x} />
    ))
  }

  render () {
    const { activity } = this.props
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
          <Dropdown closeOnSelect items={menuItems} caretOnly />
        </div>
        <div className='pl-box__content'>
          {content}
        </div>
      </section>
    )
  }
}

const ActivityRow = (props) => {
  return (
    <div className='pl-activity-feed__row'>
      <div className='pl-activity-feed__row-label' />
      <div className='pl-activity-feed__row-text'>{props.text}</div>
    </div>
  )
}