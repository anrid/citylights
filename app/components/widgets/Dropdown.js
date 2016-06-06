'use strict'

import React, { Component, PropTypes } from 'react'
import { Motion, spring } from 'react-motion'
import classnames from 'classnames'

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
    const { items, selected, heading } = this.props

    const rows = items.map((x) => {
      let isSelected = null
      let isSelectedClass = ''

      if (selected && x.text === selected) {
        isSelected = (
          <div className='pl-dropdown__checkmark'>
            <i className='fa fa-fw fa-check' />
          </div>
        )
        isSelectedClass = 'pl-dropdown__menu-item-selected'
      }

      let info = null
      if (x.info) {
        info = (
          <span className='pl-dropdown__menu-item-info'>
            {x.info}
          </span>
        )
      }

      return (
        <div key={x._id}
          className={'pl-dropdown__menu-item ' + isSelectedClass}
          onClick={() => this.onSelectItem(x)}
        >
          <div className='pl-dropdown__menu-item-text'>{x.text}</div>
          {info}
          {isSelected}
        </div>
      )
    })

    let headingRow = null
    if (heading) {
      headingRow = <div key='heading' className='pl-dropdown__menu-heading'>{heading}</div>
    }

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
              {headingRow}
              {rows}
            </div>
          </div>
        )}
      </Motion>
    )
  }

  renderSelected () {
    const { selected, caretOnly, textOnly } = this.props

    let selectedText = null
    let caretIcon = 'fa-chevron-down'
    if (!caretOnly) {
      selectedText = <div className='pl-dropdown__selected__text'>{selected}</div>
      caretIcon = 'fa-angle-down'
    }

    return (
      <div className='pl-dropdown__selected' onClick={this.onToggle}>
        {selectedText}
        {!textOnly && <i className={'fa fa-fw ' + caretIcon} />}
      </div>
    )
  }

  render () {
    const { caretOnly, textOnly } = this.props
    const cls = classnames({
      'pl-dropdown': true,
      'pl-dropdown__caret-only': caretOnly,
      'pl-dropdown__text-only': textOnly
    })
    return (
      <div className={cls}>
        {this.renderSelected()}
        {this.state.open && this.renderMenu()}
      </div>
    )
  }
}

Dropdown.propTypes = {
  onSelect: PropTypes.func.isRequired,
  closeOnSelect: PropTypes.bool,
  caretOnly: PropTypes.bool,
  textOnly: PropTypes.bool,
  selected: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.any.isRequired,
    text: PropTypes.string,
    info: PropTypes.string
  }))
}
