/* eslint-env mocha */
'use strict'

import React from 'react'
import expect from 'expect'
import * as Utils from '../../lib/testUtils'

import ConsultantForm from '../ConsultantForm'

const APP_STATE = {
  settings: {
    isConnectedToServer: true,
    identity: { userId: '123' },
    saved: { workspaceId: '456' }
  }
}

describe('ConsultantForm', () => {
  beforeEach(() => {
    Utils.resetApi()
  })

  it('renders an empty form', () => {
    const { container } = Utils.renderAndReturnStore(<ConsultantForm />, APP_STATE)

    // Ensure the form contains what we expect.
    expect(container).toBeTruthy() // Updated assertion for container
    expect(Utils.matchOne(container, 'pl-form__section-label', 'Basic information')).toBe(true)
  })

  it('submits an empty form', () => {
    const { container } = Utils.renderAndReturnStore(<ConsultantForm />, APP_STATE)

    // Submit an empty form.
    const button = Utils.findAllByClassName(container, 'pl-spinner-button')
    Utils.click(button[0])

    // Expect the current outgoing API call to be a `user:invite` message
    expect(Utils.getOutgoingApiMessage().topic).toBe('user:invite')
    expect(Utils.getOutgoingApiMessage().payload.firstName).toBe('')
  })

  it('submits an invalid form with only the firstName field set', () => {
    const { container } = Utils.renderAndReturnStore(<ConsultantForm />, APP_STATE)

    // Find the input field holding the `firstName` value,
    // set it to `Ace` and trigger a change event.
    const inputs = Utils.findAllByClassName(container, 'karma-first-name')
    const input = inputs[0]
    // input.value = 'Ace'; // Removed direct DOM manipulation
    Utils.change(input, { target: { value: 'Ace' } })

    // Submit the form again and verify the API call payload.
    const button = Utils.findAllByClassName(container, 'pl-spinner-button')
    Utils.click(button[0])
    expect(Utils.getOutgoingApiMessage().payload.firstName).toBe('Ace')
  })
})
