'use strict'

import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'

import './Dropdown.scss'

const springModel = {
  stiffness: 300,
  damping: 15
}

export default class Dropdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.onToggle = this.onToggle.bind(this)
    this.onSelectItem = this.onSelectItem.bind(this)
  }

  onToggle () {
    this.setState({ open: !this.state.open })
  }

  onSelectItem (item) {
    const { onSelect, closeOnSelect } = this.props
    onSelect(item)
    if (closeOnSelect) {
      this.onToggle()
    }
  }

  renderMenu () {
    const { items } = this.props
    const rows = items.map((x) => (
      <div key={x._id} className='pl-dropdown__menu-item'
        onClick={() => this.onSelectItem(x)}
      >
        {x.text}
      </div>
    ))

    return (
      <Motion
        defaultStyle={{ scale: 0.8, fade: 0 }}
        style={{ scale: spring(1, springModel), fade: spring(1) }}
      >
        {({ scale, fade }) => (
          <div className='pl-dropdown__menu-container'>
            <div className='pl-dropdown__outside-overlay' onClick={this.onToggle} />
            <div className='pl-dropdown__menu'
              style={{
                transform: `scale(${scale},${scale})`,
                opacity: fade
              }}
            >
              {rows}
            </div>
          </div>
        )}
      </Motion>
    )
  }

  renderSelected () {
    const { selected, caretOnly } = this.props
    let selectedText = null
    let caretClass = 'fa-chevron-down'

    if (!caretOnly) {
      selectedText = <div className='pl-dropdown__selected__text'>{selected}</div>
      caretClass = 'fa-angle-down'
    }

    return (
      <div className='pl-dropdown__selected'
        onClick={this.onToggle}
      >
        {selectedText}
        <i className={'fa fa-fw ' + caretClass} />
      </div>
    )
  }

  render () {
    const { caretOnly } = this.props
    return (
      <div className={'pl-dropdown ' + (caretOnly ? 'caret-only' : '')}>
        {this.renderSelected()}
        {this.state.open && this.renderMenu()}
      </div>
    )
  }
}
