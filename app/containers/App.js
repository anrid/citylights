
import React, { Component } from 'react'
import { Provider } from 'react-redux'

import '../styles/normalize.css'
import '../styles/global.scss'

import configureStore from '../lib/configureStore'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import * as apiClient from '../lib/apiClient'
import * as settingsActions from '../actions/settingsActions'

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
apiClient.setStore(store)

// Connect to our backend.
apiClient.connect({ url: window.Config.API_URL })

// All our pages.
import Login from '../containers/Login'
import Signup from '../containers/Signup'
import Overview from '../containers/Overview'
import Settings from '../containers/Settings'

const NoMatch = () => <div>NoMatch.</div>
const Account = () => <div>Account.</div>
// const Login = () => <div>Login.</div>
// const Signup = () => <div>Signup.</div>
const Logout = () => <div>Logout.</div>
// const Overview = () => <div>Overview.</div>

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
          <Route path='account' component={Account} onEnter={requireAuth} />
          <Route path='overview' component={Overview} onEnter={requireAuth} />
          <Route path='settings' component={Settings} onEnter={requireAuth} />

          <Route path='login' component={Login} onEnter={skipIfAuth} />
          <Route path='logout' component={Logout} />
          <Route path='signup' component={Signup} onEnter={skipIfAuth} />

          <Route path='*' component={NoMatch} />
        </Router>
      </Provider>
    )
  }
}
