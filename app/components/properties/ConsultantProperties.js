'use strict'

import React, { Component } from 'react'

import './ConsultantProperties.scss'

import Dropdown from '../widgets/Dropdown'
import ConsultantPropertiesForm from './ConsultantPropertiesForm'

export default class ConsultantProperties extends Component {
  constructor (props) {
    super(props)
    this.onDropdownSelect = this.onDropdownSelect.bind(this)
    this.state = {
      editMode: false
    }
  }

  onDropdownSelect (command) {
    console.log('TODO: Perform some dropdown action, command=', command)
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

  renderProfile () {
    const { consultant } = this.props
    if (!consultant) {
      return (
        <div className='pl-box__content-empty'>
          <div className='pl-box__content-empty__text'>
            No consultant found.
          </div>
        </div>
      )
    }

    // console.log('Render consultant=', consultant)

    return (
      <div className='pl-consultant-properties__profile'>
        <div className='pl-consultant-properties__profile-block'>
          <div className='pl-consultant-properties__left'>
            <div className='pl-consultant-properties__profile-photo'
              style={{ backgroundImage: `url(${consultant.photo})` }}/>
          </div>

          <div className='pl-consultant-properties__right'>
            <div className='pl-consultant-properties__personal-info'>
              <div className='pl-consultant-properties__profile-entry'>
                <div className='pl-consultant-properties__profile-label'>
                  Name:
                </div>
                <div className='pl-consultant-properties__profile-big-text'>
                  {consultant.firstName} {consultant.lastName}
                </div>
              </div>

              <div className='pl-consultant-properties__profile-entry'>
                <div className='pl-consultant-properties__profile-label'>
                  Age:
                </div>
                <div className='pl-consultant-properties__profile-big-text'>
                  {consultant.profile.age}
                </div>
              </div>

              <div className='pl-consultant-properties__profile-entry'>
                <div className='pl-consultant-properties__profile-label'>
                  Gender:
                </div>
                <div className='pl-consultant-properties__profile-big-text'>
                  <i className='fa fa-venus' />
                </div>
              </div>
            </div>

            <div className='pl-consultant-properties__work-info'>
              <div className='pl-consultant-properties__profile-entry'>
                <div className='pl-consultant-properties__profile-label'>
                  Title:
                </div>
                <div className='pl-consultant-properties__profile-medium-text'>
                  {consultant.profile.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { consultant } = this.props
    const { editMode } = this.state
    return (
      <section className='pl-box pl-consultant-properties'>
        <div className='pl-box__header'>
          <div>Consultant: {consultant.firstName} {consultant.lastName}</div>
          {this.renderDropdown()}
        </div>
        <div className='pl-box__content pl-box__content--with-footer pl-box__content--no-padding'>
          {editMode
            ? <ConsultantPropertiesForm {...this.props} />
            : this.renderProfile()
          }
        </div>
        <div className='pl-box__footer'>
          <div>Status: Logged in.</div>
          {editMode
            ? <div className='pl-link' onClick={() => this.setState({ editMode: false })}>back</div>
            : <div className='pl-link' onClick={() => this.setState({ editMode: true })}>edit</div>
          }
        </div>
      </section>
    )
  }
}

ConsultantProperties.propTypes = {
  consultant: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
}
