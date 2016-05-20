'use strict'

import React, { Component } from 'react'
import debounce from 'lodash.debounce'

import './ConsultantList.scss'

import Dropdown from './Dropdown'

export default class ConsultantList extends Component {
  constructor (props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this._doSearch = debounce(this._doSearch.bind(this), 350)
  }

  onSelect (command) {
    console.log('TODO: Show consultant, command=', command)
  }

  onSearch (e) {
    const query = e.target.value
    this._doSearch(query)
  }

  _doSearch (query) {
    const { actions } = this.props
    console.log('Searching consultants, query=', query)
    actions.setSearchQuery({ consultants: query })
  }

  renderConsultantRows () {
    const { consultants } = this.props
    return consultants.map((x, i) => (
      <ConsultantRow key={x._id} {...x} />
    ))
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

  renderButtons () {
    const { actions } = this.props
    return (
      <button
        className='pl-form-button'
        onClick={() => actions.routeTo({ url: '/consultants/add' })}
      >
        <i className='fa fa-plus'/>
        Add
      </button>
    )
  }

  renderDropdown () {
    const menuItems = [
      { _id: 1, text: 'Action #1' },
      { _id: 2, text: 'Action #2' }
    ]

    return (
      <Dropdown
        closeOnSelect
        items={menuItems}
        caretOnly
        onSelect={this.onSelect}
      />
    )
  }

  render () {
    const { consultants, actions } = this.props
    let content

    if (!consultants || !consultants.length) {
      content = (
        <div className='pl-box__content-empty'>
          <div className='pl-box__content-empty__text'>
            No consultants registered with this Team yet.
          </div>
          <button onClick={() => actions.routeTo({ url: '/consultants/add' })}>
            Add a Consultant
          </button>
        </div>
      )
    } else {
      content = (
        <div className='pl-consultant-list__rows'>
          {consultants.map((x, i) => (
            <ConsultantRow key={x._id} {...x} />
          ))}
        </div>
      )
    }

    return (
      <section className='pl-box pl-consultant-list'>
        <div className='pl-box__header'>
          <div>Consultants</div>
          <div className='pl-consultant-list__header-panel'>
            {this.renderSearchBox()}
            {this.renderButtons()}
          </div>
          {this.renderDropdown()}
        </div>
        <div className='pl-box__content'>
          {content}
        </div>
      </section>
    )
  }
}

ConsultantList.propTypes = {
  actions: React.PropTypes.object.isRequired
}

const ConsultantRow = (props) => {
  return (
    <div className='pl-consultant-list__row'>
      <div className='pl-consultant-list__row-label' />
      <div className='pl-consultant-list__row-avatar'
        style={{ backgroundImage: `url(${props.photo})` }}
      />
      <div className='pl-consultant-list__row-info'>
        <div className='pl-consultant-list__row-info__name'>
          {props.firstName}{' '}{props.lastName}
        </div>
        <div className='pl-consultant-list__row-info__personal'>
          {props.email}
        </div>
      </div>
    </div>
  )
}
