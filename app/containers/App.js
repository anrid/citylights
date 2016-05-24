
import React, { Component } from 'react'
import { Provider } from 'react-redux'

import '../styles/normalize.css'
import '../styles/global.scss'

import configureStore from '../lib/configureStore'
import { Router, Route, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import * as apiClient from '../lib/apiClient'
import * as settingsActions from '../actions/settingsActions'
import { receiveBackendEvent } from '../actions/backendActions'

// Check app config.
if (!window.Config) {
  console.error('Missing app config, remember to set `window.Config` !')
}

// Create an empty store, or one with fixtures depending on the
// mode we’re in.
const store = configureStore({ useFixtures: false })
settingsActions.restoreState(store)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store)

// Connect our store to the API client.
apiClient.addEventListener((event) => {
  store.dispatch(receiveBackendEvent(event))
})

// Fetch identity from store, if we have one.
const identity = store.getState().settings.identity

// Connect to our backend.
apiClient.connect({
  url: window.Config.API_URL,
  accessToken: identity && identity.accessToken
})

// All our pages.
import Login from '../containers/Login'
import Signup from '../containers/Signup'
import Overview from '../containers/Overview'
import Consultants from '../containers/Consultants'
import Settings from '../containers/Settings'
import ComponentBuilder from '../containers/ComponentBuilder'
import Planning from '../containers/Planning'

const NoMatch = () => <div>NoMatch.</div>
const Logout = () => <div>Logout.</div>

function requireAuth (nextState, replace) {
  const { identity } = store.getState().settings
  if (!identity || !identity.accessToken) {
    const nextPathname = nextState.location.pathname
    console.log(
      'requireAuth: no accessToken found, redirecting to /login.',
      'nextPathname=', nextPathname
    )
    replace({
      pathname: '/login',
      state: { nextPathname }
    })
  }
}

function skipIfAuth (nextState, replace) {
  const { identity } = store.getState().settings
  if (identity && identity.accessToken) {
    console.log('skipIfAuth: found identity=', identity)
    replace({ pathname: '/' })
  }
}

export default class App extends Component {
  componentDidMount () {
    // Initialize app.
    store.dispatch(settingsActions.initApp())
  }

  render () {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Route path='/' component={Overview} onEnter={requireAuth} />
          <Route path='/overview' component={Overview} onEnter={requireAuth} />
          <Route path='/consultants' component={Consultants} onEnter={requireAuth}>
            <Route path='add' component={Consultants} />
          </Route>
          <Route path='/planning' component={Planning} onEnter={requireAuth} />
          <Route path='/settings' component={Settings} onEnter={requireAuth} />
          <Route path='/login' component={Login} onEnter={skipIfAuth} />
          <Route path='/signup' component={Signup} onEnter={skipIfAuth} />
          <Route path='/logout' component={Logout} />
          <Route path='/builder' component={ComponentBuilder} onEnter={requireAuth} />
          <Route path='*' component={NoMatch} />
        </Router>
      </Provider>
    )
  }
}
