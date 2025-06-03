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
    const { getByText, queryByText } = Utils.render(<Loader page={DummyPage} />)
    expect(getByText('Loading..')).toBeTruthy()
    expect(queryByText('Nice!')).toBe(null)
  })

  it('shows page when app is loaded', () => {
    const { getByText, queryByText } = Utils.render(
      <Loader page={DummyPage} />,
      { settings: { isAppLoaded: true } } // Initial state !
    )
    expect(getByText('Nice!')).toBeTruthy()
    expect(queryByText('Loading..')).toBe(null)
  })
})
