'use strict'

import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import { consultantItemsSelector } from '../selectors/users'

import WidgetPopup from '../components/widgets/WidgetPopup'
import InputWidget from '../components/widgets/InputWidget'

function ConsultantsWidget(props) {
  const dispatch = useDispatch()
  const items = useSelector(consultantItemsSelector)
  
  const actions = {
    ...Object.keys(settingsActions).reduce((acc, key) => {
      acc[key] = (...args) => dispatch(settingsActions[key](...args))
      return acc
    }, {})
  }

  const onSearch = useCallback((query) => {
    console.log('onSearch, query=', query)
    actions.setSearchQuery({ consultantsInputWidget: query })
  }, [actions])

  return (
    <WidgetPopup {...props} items={items} actions={actions}>
      <InputWidget
        {...props}
        items={items}
        actions={actions}
        onSearch={onSearch}
      />
    </WidgetPopup>
  )
}

export default ConsultantsWidget
