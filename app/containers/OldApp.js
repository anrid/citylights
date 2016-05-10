
import React, { Component } from 'react'
import { Provider } from 'react-redux'

import * as apiClient from '../lib/apiClient'
import configureStore from '../lib/configureStore'

import Pages from './Pages'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.store = configureStore()
  }

  componentDidMount () {
    // Connect our store so we can dispatch backend events.
    apiClient.setStore(this.store)

    // Connect to our backend.
    // TODO: Don’t hardcode this url !
    apiClient.connect({ url: 'wss://citylights-dev.fina.io:9999' })
  }

  render () {
    return (
      <Provider store={this.store}>
        <Pages />
      </Provider>
    )
  }
}
