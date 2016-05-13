'use strict'

import React, { Component } from 'react'

import './Box.scss'

export default class Box extends Component {
  renderMenu () {
    const { menu } = this.props
    if (!menu) {
      return null
    }

    return (
      <div className='pl-box__header-menu'>
        {menu.map((x, i) => (
          <div key={i}>{x.text}</div>
        ))}
      </div>
    )
  }
  render () {
    const { header, content, className } = this.props
    return (
      <section className={'pl-box ' + className}>

        <div className='pl-box__header'>
          {header}
          {this.renderMenu()}
        </div>

        <div className='pl-box__content'>
          {content}
        </div>
      </section>
    )
  }
}
