'use strict'

import React, { Component } from 'react'

import './ConsultantList.scss'

import Dropdown from './Dropdown'

export default class ConsultantList extends Component {
  constructor (props) {
    super(props)
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect (command) {
    console.log('TODO: Implement this:', command)
  }

  renderConsultantRows () {
    const { consultants } = this.props
    return consultants.map((x, i) => (
      <ConsultantRow key={x._id} {...x} />
    ))
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
      content = consultants.map((x, i) => (
        <ConsultantRow key={x._id} {...x} />
      ))
    }

    const menuItems = [
      { _id: 1, text: 'Action #1' },
      { _id: 2, text: 'Action #2' }
    ]

    return (
      <section className='pl-box pl-consultant-list'>
        <div className='pl-box__header'>
          <div>Consultants</div>
          <Dropdown
            closeOnSelect
            items={menuItems}
            caretOnly
            onSelect={this.onSelect}
          />
        </div>
        <div className='pl-box__content'>
          <div className='pl-consultant-list__rows'>
            {content}
          </div>
        </div>
      </section>
    )
  }
}

const ConsultantRow = (props) => {
  return (
    <div className='pl-consultant-list__row'>
      <div className='pl-consultant-list__row-label' />
      <div className='pl-consultant-list__row-avatar' />
      <div className='pl-consultant-list__row-info'>
        <div className='pl-consultant-list__row-info__name'>
          Jane Doe
        </div>
        <div className='pl-consultant-list__row-info__personal'>
          {props.email}
        </div>
      </div>
    </div>
  )
}
