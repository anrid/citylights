'use strict'

import React from 'react'
import { Provider } from 'react-redux'
import { render as rtlRender, fireEvent } from '@testing-library/react'
import * as apiClient from './apiClient'
import configureStore from './configureStore'

// Helper function to render with Redux store
function renderWithProviders (
  ui,
  { initialState, store = configureStore({ initialState }), ...renderOptions } = {}
) {
  function Wrapper ({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  const rendered = rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
  return {
    ...rendered,
    store // Return the store instance
  }
}

// Re-export render function, which can now also serve for renderAndReturnStore
export function render (component, initialState) {
  return renderWithProviders(component, { initialState })
}

export function renderAndReturnStore (component, initialState) {
  return renderWithProviders(component, { initialState })
}

export function resetApi () {
  return apiClient.getMessageBuffer().clear()
}

export function getOutgoingApiMessage () {
  return apiClient.getMessageBuffer().first()
}

// Replaces TestUtils.scryRenderedDOMComponentsWithClass
export function findAllByClassName (container, className) {
  return container.getElementsByClassName(className)
}

// Replaces TestUtils.Simulate.click
export function click (element) {
  return fireEvent.click(element)
}

// Replaces TestUtils.Simulate.change
// Note: For input elements, you might need to provide event properties like { target: { value: '...' } }
export function change (element, eventProperties) {
  return fireEvent.change(element, eventProperties)
}

export function matchOne (container, className, pattern) {
  const re = new RegExp(pattern)
  const elements = findAllByClassName(container, className)
  for (let i = 0; i < elements.length; i++) {
    if (re.test(elements[i].outerHTML) || re.test(elements[i].textContent)) {
      return true
    }
  }
  return false
}

// Export other utilities from @testing-library/react if needed directly in tests
export { fireEvent }
