'use strict'
/*
 * Component builder is used to render components in their various states,
 * to simplify development.
 */

import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import './ComponentBuilder.scss'

import * as settingsActions from '../actions/settingsActions'
import { consultantItemsSelector } from '../selectors/users'

import BasicLayout from './BasicLayout'

// Various components we wish to rende
import InputWidget from '../components/widgets/InputWidget'
import Loader from './Loader'

function ComponentBuilder() {
  const [isReloading, setIsReloading] = useState(false)
  const [inputWidget, setInputWidget] = useState({
    usersSelected: []
  })
  
  const dispatch = useDispatch()
  const consultantItems = useSelector(state => consultantItemsSelector(state))
  const settings = useSelector(state => state.settings)

  useEffect(() => {
    if (isReloading) {
      console.log('Reloading in 250 ms.')
      setTimeout(() => {
        console.log('Updated !')
        setIsReloading(false)
      }, 250)
    }
  }, [isReloading])

  const renderComponents = useCallback(() => {
    if (isReloading) {
      return <Comment>Reloading all the things ..</Comment>
    }

    return (
      <div className='pl-component-builder__components'>
        {renderInputWidget()}
      </div>
    )
  }, [isReloading])

  const renderInputWidget = useCallback(() => {
    // Render all the things !
    const inputWidgetItems = [
      { _id: 1, text: 'Ace', photo: null },
      { _id: 2, text: 'Base', photo: null },
      { _id: 3, text: 'Chase', photo: null }
    ]
    const selected = [3]

    const onSearch = (query) => {
      dispatch(settingsActions.setSearchQuery({ consultantsInputWidget: query }))
    }

    const onSelectDoNothing = (id, type) => {
      console.log('onSelect, id=', id, 'type=', type)
    }

    const onSelectUser = (id, type) => {
      console.log('onSelectUser, id=', id, 'type=', type)
      let selected = (inputWidget.usersSelected || [])
      if (selected.find((x) => x === id)) {
        selected = selected.filter((x) => x !== id)
      } else {
        selected = selected.concat(id)
      }
      setInputWidget({ usersSelected: selected })
    }

    return (
      <div>
        <Comment>Standard input widget.</Comment>
        <InputWidget items={inputWidgetItems} onSearch={onSearch}
          selected={selected} onSelect={onSelectDoNothing} />

        <Comment>Standard input widget with opening animation, showing all consultants.</Comment>
        <InputWidget
          items={consultantItems}
          selected={inputWidget.usersSelected}
          animate
          onSearch={onSearch}
          onSelect={onSelectUser}
        />
      </div>
    )
  }, [dispatch, consultantItems, inputWidget.usersSelected])

  return (
    <BasicLayout className='pl-component-builder'>
      <Comment>Developer Panel:</Comment>
      <button onClick={() => setIsReloading(true)}>
        {isReloading ? <i className='fa fa-cog fa-spin' /> : 'Refresh All'}
      </button>
      {renderComponents()}
    </BasicLayout>
  )
}

const Comment = ({ children }) => (
  <div className='pl-component-builder__comment'>
    {children}
  </div>
)

const ComponentBuilderPage = () => (
  <Loader page={ComponentBuilder} />
)

export default ComponentBuilderPage
