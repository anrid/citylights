
import React from 'react'
import { Provider } from 'react-redux'

import configureStore from '../lib/configureStore'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
const store = configureStore({ useFixtures: false })

// All our pages.

const FrontPage = () => <div>Front Page.</div>
const AboutPage = () => <div>About Page.</div>
const NoMatch = () => <div>NoMatch.</div>
const Account = () => <div>Account.</div>
const Login = () => <div>Login.</div>
const Signup = () => <div>Signup.</div>
const Logout = () => <div>Logout.</div>

const WebSite = (props) => (
  <div>
    <h1>WebSite</h1>

    <Link to='/login'>Login</Link>{' '}
    <Link to='/signup'>Sign Up</Link>{' '}
    <Link to='/turbo/'>Go to App</Link>{' '}

    <section style={{ border: '1px solid red' }}>
      {props.children}
    </section>
  </div>
)

const App = (props) => (
  <div>
    <h1>Inside App (workspace: {props.params.workspaceUrl})</h1>

    <Link to={`${props.params.workspaceUrl}`}>Overview</Link>{' '}
    <Link to={`${props.params.workspaceUrl}/account`}>Account Page</Link>{' '}
    <Link to={`${props.params.workspaceUrl}/logout`}>Log out</Link>{' '}
    <Link to='/'>Back to Front Page.</Link>{' '}

    <section style={{ border: '1px solid blue' }}>
      {props.children}
    </section>
  </div>
)

const Overview = () => <div>Overview.</div>

function AppRoot() {
  return (
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path='/' component={WebSite}>
          <IndexRoute component={FrontPage} />
          <Route path='about' component={AboutPage} />
          <Route path='login' component={Login} />
          <Route path='signup' component={Signup} />
        </Route>
        <Route path='/:workspaceUrl' component={App}>
          <IndexRoute component={Overview} />
          <Route path='account' component={Account} />
          <Route path='logout' component={Logout} />
        </Route>
        <Route path='*' component={NoMatch} />
      </Router>
    </Provider>
  )
}

export default AppRoot
