'use strict'

import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'

import './ConsultantList.scss'

import Dropdown from './widgets/Dropdown'
import ConsultantCard from '../containers/ConsultantCard'
import Button from '../planner/Button'

function ConsultantList({ consultants, actions }) {
  const [query, setQuery] = useState(null)

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      console.log('Searching consultants, query=', searchQuery)
      setQuery(searchQuery)
      actions.setSearchQuery({ consultants: searchQuery })
    }, 350),
    [actions]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      actions.setSearchQuery({ consultants: null })
    }
  }, [actions])

  const onDropdownSelect = (command) => {
    console.log('TODO: Perform some dropdown action, command=', command)
  }

  const onSearch = (e) => {
    const searchQuery = e.target.value
    debouncedSearch(searchQuery)
  }

  const renderConsultantRows = () => {
    return (
      <div className='pl-consultant-list__rows'>
        {consultants.map((x, i) => (
          <ConsultantCard key={x._id} userId={x._id} />
        ))}
      </div>
    )
  }

  const renderSearchBox = () => {
    return (
      <div className='pl-form__input--with-icon'>
        <i className='fa fa-fw fa-search' />
        <input type='text'
          placeholder='Search for a Consultant'
          onChange={onSearch}
        />
      </div>
    )
  }

  const renderButtons = () => {
    return (
      <Button onClick={() => actions.routeTo({ url: '/consultants/add' })}>
        <i className='fa fa-fw fa-plus'/> Add Consultant
      </Button>
    )
  }

  const renderDropdown = () => {
    const menuItems = [
      { _id: 1, text: 'Action #1' },
      { _id: 2, text: 'Action #2' }
    ]

    return (
      <Dropdown
        closeOnSelect
        items={menuItems}
        caretOnly
        onSelect={onDropdownSelect}
      />
    )
  }

  let content
  const isEmpty = !consultants || !consultants.length
  if (isEmpty) {
    let text = 'No consultants registered with this Team yet.'
    if (query) {
      text = `No consultants found with the name "${query}".`
    }
    content = (
      <div className='pl-box__content-empty'>
        <div className='pl-box__content-empty__text'>
          {text}
        </div>
        {renderButtons()}
      </div>
    )
  } else {
    content = renderConsultantRows()
  }

  return (
    <section className='pl-box pl-consultant-list'>
      <div className='pl-box__header'>
        <div>Consultants</div>
        <div className='pl-consultant-list__header-panel'>
          {renderSearchBox()}
        </div>
        {renderDropdown()}
      </div>
      <div className='pl-box__content pl-box__content--with-footer'>
        {content}
        {!isEmpty && renderButtons()}
      </div>
      <div className='pl-box__footer'>
        <div className='pl-box__footer__info'>
          Showing {consultants.length} Consultants.
        </div>
      </div>
    </section>
  )
}

ConsultantList.propTypes = {
  actions: PropTypes.object.isRequired
}

export default ConsultantList
