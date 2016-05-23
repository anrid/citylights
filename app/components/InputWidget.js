'use strict'

import React, { Component } from 'react'
import { Motion, spring } from 'react-motion'
import debounce from 'lodash.debounce'

import './InputWidget.scss'

const springModel = {
  stiffness: 300,
  damping: 15
}

export default class InputWidget extends Component {
  constructor (props) {
    super(props)
    this.onSearch = this.onSearch.bind(this)
    this._doSearch = debounce(this._doSearch.bind(this), 350)
    this.onRowSelect = this.onRowSelect.bind(this)
  }

  onRowSelect (command) {
    console.log('TODO: onRowSelect, command=', command)
  }

  onSearch (e) {
    const query = e.target.value
    this._doSearch(query)
  }

  _doSearch (query) {
    // const { actions } = this.props
    console.log('TODO: _doSearch, query=', query)
  }

  renderSearchBox () {
    return (
      <div className='pl-form__input--with-icon'>
        <i className='fa fa-fw fa-search' />
        <input type='text'
          placeholder='Search for a Consultant'
          onChange={this.onSearch}
        />
      </div>
    )
  }

  renderContent (scale, fade) {
    let style = { }
    // Apply style when both scale and fade are neither null nor undefined.
    if (scale != null && fade != null) {
      style = {
        transform: `scale(${scale},${scale})`,
        opacity: fade
      }
    }

    const { items } = this.props

    return (
      <section className='pl-input-widget' style={style}>
        <div className='pl-input-widget__header'>
          {this.renderSearchBox()}
        </div>
        <div className='pl-input-widget__items'>
          {items.map((x) => <div key={x._id}>{x.text}</div>)}
        </div>
        <div className='pl-input-widget__footer'>
          Showing {items.length} items.
        </div>
      </section>
    )
  }

  renderContentWithAnimation (content) {
    return (
      <Motion
        defaultStyle={{ scale: 0.8, fade: 0 }}
        style={{ scale: spring(1, springModel), fade: spring(1) }}
      >
        {({ scale, fade }) => this.renderContent(scale, fade)}
      </Motion>
    )
  }

  render () {
    const { animate } = this.props
    if (animate) {
      return this.renderContentWithAnimation()
    }
    return this.renderContent()
  }
}

InputWidget.propTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  animate: React.PropTypes.bool
}
