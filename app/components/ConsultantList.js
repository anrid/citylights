'use strict'

import React, { Component } from 'react'
import debounce from 'lodash.debounce'

import './ConsultantList.scss'

import Dropdown from './Dropdown'

export default class ConsultantList extends Component {
  constructor (props) {
    super(props)
    this.onDropdownSelect = this.onDropdownSelect.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this._doSearch = debounce(this._doSearch.bind(this), 350)
    this.onRowSelect = this.onRowSelect.bind(this)
  }

  onRowSelect (command) {
    const { actions } = this.props
    actions.showConsultantProperties(command.userId)
  }

  onDropdownSelect (command) {
    console.log('TODO: Perform some dropdown action, command=', command)
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
    return (
      <div className='pl-consultant-list__rows'>
        {consultants.map((x, i) => (
          <ConsultantRow key={x._id} data={x} onClick={this.onRowSelect} />
        ))}
      </div>
    )
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
        onSelect={this.onDropdownSelect}
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
      content = this.renderConsultantRows()
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
        <div className='pl-box__content--with-footer'>
          {content}
        </div>
        <div className='pl-box__footer'>
          <div className='pl-box__footer__info'>
            Showing {consultants.length} Consultants.
          </div>
        </div>
      </section>
    )
  }
}

ConsultantList.propTypes = {
  actions: React.PropTypes.object.isRequired
}

const ConsultantRow = ({ data, onClick }) => {
  return (
    <div className='pl-consultant-list__row' onClick={() => onClick({ userId: data._id })}>
      <div className='pl-consultant-list__row-label' />
      <div className='pl-consultant-list__row-avatar'
        style={{ backgroundImage: `url(${data.photo})` }}
      />
      <div className='pl-consultant-list__row-info'>
        <div className='pl-consultant-list__row-info__name'>
          {data.firstName}{' '}{data.lastName}
        </div>
        <div className='pl-consultant-list__row-info__personal'>
          {data.email}
        </div>
      </div>
    </div>
  )
}
