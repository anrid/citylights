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
    const { root } = Utils.renderAndReturnStore(<ConsultantForm />, APP_STATE)

    // Ensure the form contains what we expect.
    expect(root).toExist()
    expect(Utils.matchOne(root, 'pl-form__section-label', 'Basic information')).toBe(true)
  })

  it('submits an empty form', () => {
    const { root } = Utils.renderAndReturnStore(<ConsultantForm />, APP_STATE)

    // Submit an empty form.
    const button = Utils.findAll(root, 'pl-spinner-button')
    Utils.click(button[0])

    // Expect the current outgoing API call to be a `user:invite` message
    expect(Utils.getOutgoingApiMessage().topic).toBe('user:invite')
    expect(Utils.getOutgoingApiMessage().payload.firstName).toBe('')
  })

  it('submits an invalid form with only the firstName field set', () => {
    const { root } = Utils.renderAndReturnStore(<ConsultantForm />, APP_STATE)

    // Find the input field holding the `firstName` value,
    // set it to `Ace` and trigger a change event.
    const [ input ] = Utils.findAll(root, 'karma-first-name')
    input.value = 'Ace'
    Utils.change(input)

    // Submit the form again and verify the API call payload.
    const button = Utils.findAll(root, 'pl-spinner-button')
    Utils.click(button[0])
    expect(Utils.getOutgoingApiMessage().payload.firstName).toBe('Ace')
  })
})
