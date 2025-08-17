import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'

// Import all the Redux slices
import counterSlice from '../store/counterSlice.js'
import settingsSlice from '../store/settingsSlice.js'
import workspacesSlice from '../store/workspacesSlice.js'
import usersSlice from '../store/usersSlice.js'
import projectsSlice from '../store/projectsSlice.js'
import shiftsSlice from '../store/shiftsSlice.js'

// Create a test store with all slices
function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      counter: counterSlice,
      settings: settingsSlice,
      workspaces: workspacesSlice,
      users: usersSlice,
      projects: projectsSlice,
      shifts: shiftsSlice
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false // Disable for testing
      })
  })
}

// Test wrapper component that provides Redux store and Router
function TestWrapper({ children, initialState, withRouter = true }) {
  const store = createTestStore(initialState)
  
  if (withRouter) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

// Custom render function that wraps component with providers
export function render(ui, options = {}) {
  const {
    initialState = {},
    withRouter = true,
    ...renderOptions
  } = options

  const store = createTestStore(initialState)

  const AllTheProviders = ({ children }) => {
    const content = withRouter ? (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    ) : children

    return (
      <Provider store={store}>
        {content}
      </Provider>
    )
  }

  return {
    store,
    ...rtlRender(ui, { wrapper: AllTheProviders, ...renderOptions })
  }
}

// Helper to render with store access for testing Redux interactions
export function renderWithStore(ui, initialState = {}) {
  const store = createTestStore(initialState)
  
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  )

  const result = rtlRender(ui, { wrapper: Wrapper })
  
  return {
    store,
    ...result
  }
}

// Helper for components that don't need router
export function renderWithoutRouter(ui, initialState = {}) {
  return render(ui, { initialState, withRouter: false })
}

// Mock API client helpers (to replace the old API testing utilities)
export function mockApiClient() {
  const messages = []
  
  return {
    sendMessage: vi.fn((message) => {
      messages.push(message)
      return Promise.resolve({ topic: `${message.topic}:response`, payload: {} })
    }),
    getLastMessage: () => messages[messages.length - 1],
    getAllMessages: () => [...messages],
    clearMessages: () => messages.length = 0
  }
}

// Export everything from @testing-library/react for convenience
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'