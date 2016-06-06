'use strict'

import React, { Component } from 'react'
import debounce from 'lodash.debounce'

import './ConsultantList.scss'

import Dropdown from './widgets/Dropdown'
import ConsultantCard from '../containers/ConsultantCard'
import Button from '../planner/Button'

export default class ConsultantList extends Component {
  constructor (props) {
    super(props)
    this.onDropdownSelect = this.onDropdownSelect.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this._doSearch = debounce(this._doSearch.bind(this), 350)
    this.state = { query: null }
  }

  componentWillUnmount () {
    this.props.actions.setSearchQuery({ consultants: null })
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
    this.setState({ query })
    actions.setSearchQuery({ consultants: query })
  }

  renderConsultantRows () {
    const { consultants } = this.props
    return (
      <div className='pl-consultant-list__rows'>
        {consultants.map((x, i) => (
          <ConsultantCard key={x._id} userId={x._id} />
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
      <Button onClick={() => actions.routeTo({ url: '/consultants/add' })}>
        <i className='fa fa-fw fa-plus'/> Add Consultant
      </Button>
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
    const { consultants } = this.props
    const { query } = this.state
    let content

    const isEmpty = !consultants || !consultants.length
    if (isEmpty) {
      let text = 'No consultants registered with this Team yet.'
      if (query) {
        text = `No consultants found with the name “${query}”.`
      }
      content = (
        <div className='pl-box__content-empty'>
          <div className='pl-box__content-empty__text'>
            {text}
          </div>
          {this.renderButtons()}
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
          </div>
          {this.renderDropdown()}
        </div>
        <div className='pl-box__content pl-box__content--with-footer'>
          {content}
          {!isEmpty && this.renderButtons()}
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
