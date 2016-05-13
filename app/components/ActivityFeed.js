'use strict'

import React, { Component } from 'react'

import './ActivityFeed.scss'

import Box from './Box'

export default class ActivityFeed extends Component {
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

    const menu = [
      { text: 'Dismiss All' }
    ]

    return (
      <Box
        className='pl-activity-feed'
        style={{ width: 210 }}
        header='Activity'
        menu={menu}
        content={content}
      />
    )
  }
}

const ActivityRow = (props) => {
  return (
    <div className='pl-activity-feed__row'>
      {props.text}
    </div>
  )
}
