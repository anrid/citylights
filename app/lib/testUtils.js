'use strict'

import React from 'react'
import { Provider } from 'react-redux'
import TestUtils from 'react-addons-test-utils'
import * as apiClient from './apiClient'

import configureStore from './configureStore'

export function withStore (component, initialState) {
  const store = configureStore({ initialState })
  return (
    <Provider store={store}>
      {component}
    </Provider>
  )
}

export function render (component, initialState) {
  return TestUtils.renderIntoDocument(withStore(component, initialState))
}

export function renderAndReturnStore (component, initialState) {
  const store = configureStore({ initialState })
  const root = TestUtils.renderIntoDocument(withStore(component, initialState))
  return {
    root,
    store
  }
}

export function resetApi () {
  return apiClient.getMessageBuffer().clear()
}

export function getOutgoingApiMessage () {
  return apiClient.getMessageBuffer().first()
}

export function findAll (tree, className) {
  return TestUtils.scryRenderedDOMComponentsWithClass(tree, className)
}

export function click (node) {
  return TestUtils.Simulate.click(node)
}

export function change (node) {
  return TestUtils.Simulate.change(node)
}

export function matchOne (tree, className, pattern) {
  const re = new RegExp(pattern)
  const res = findAll(tree, className)
  .map((x) => x.outerHTML)
  .filter((x) => x.match(re))
  return res.length > 0
}
