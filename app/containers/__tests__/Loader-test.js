/* eslint-env mocha */
'use strict'

import React from 'react'
import expect from 'expect'
import * as Utils from '../../lib/testUtils'

import Loader from '../Loader'

class DummyPage extends React.Component {
  render () {
    return <div className='test-page'>Nice!</div>
  }
}

describe('Loader', () => {
  it('shows loader while app isn’t loaded', () => {
    const root = Utils.render(<Loader page={DummyPage} />)
    expect(root).toExist()
    expect(Utils.matchOne(root, 'pl-loading__text', 'Loading..')).toBe(true)
    expect(Utils.matchOne(root, 'test-page', 'Nice!')).toBe(false)
  })

  it('shows page when app is loaded', () => {
    const root = Utils.render(
      <Loader page={DummyPage} />,
      { settings: { isAppLoaded: true } } // Initial state !
    )
    expect(root).toExist()
    expect(Utils.matchOne(root, 'pl-loading__text', 'Loading..')).toBe(false)
    expect(Utils.matchOne(root, 'test-page', 'Nice!')).toBe(true)
  })
})
