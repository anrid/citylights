
import React, { Component } from 'react'
import { Provider, useSelector } from 'react-redux'

import '../styles/normalize.css'
import '../styles/global.scss'

import configureStore from '../lib/configureStore'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

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
// TODO: Replace with React Router 6 patterns
// const history = syncHistoryWithStore(hashHistory, store)

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
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Overview from './pages/Overview.jsx'
import Consultants from './pages/Consultants.jsx'
import Settings from './pages/Settings.jsx'
import ComponentBuilder from './ComponentBuilder.jsx'
import Planning from './pages/Planning.jsx'
import TimePlannerApp from '../planner/TimePlannerApp.jsx'

const NoMatch = () => <div>NoMatch.</div>
const Logout = () => <div>Logout.</div>

// Legacy auth functions - replaced by ProtectedRoute and PublicRoute components

// Protected Route component for React Router 6
function ProtectedRoute({ children }) {
  const identity = useSelector(state => state.settings.identity)
  if (!identity || !identity.accessToken) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Public Route component (redirect to overview if already authenticated)
function PublicRoute({ children }) {
  const identity = useSelector(state => state.settings.identity)
  if (identity && identity.accessToken) {
    return <Navigate to="/overview" replace />
  }
  return children
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
        <Route path="/consultants" element={<ProtectedRoute><Consultants /></ProtectedRoute>} />
        <Route path="/consultants/add" element={<ProtectedRoute><Consultants /></ProtectedRoute>} />
        <Route path="/planning" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/time" element={<ProtectedRoute><TimePlannerApp /></ProtectedRoute>} />
        <Route path="/builder" element={<ProtectedRoute><ComponentBuilder /></ProtectedRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  React.useEffect(() => {
    // Initialize app.
    store.dispatch(settingsActions.initApp())
  }, [])

  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  )
}
