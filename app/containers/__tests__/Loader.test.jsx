import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import settingsSlice from '../../store/settingsSlice.js'
import Loader from '../Loader'

// Simple test component
function DummyPage() {
  return <div data-testid="test-page">Nice!</div>
}

function createTestStore(initialState = {}) {
  return configureStore({
    reducer: {
      settings: settingsSlice
    },
    preloadedState: initialState
  })
}

describe('Loader', () => {
  it('shows loader while app isn\'t loaded', () => {
    const store = createTestStore({
      settings: {
        isAppLoaded: false,
        isAppLoading: true
      }
    })

    render(
      <Provider store={store}>
        <Loader page={DummyPage} />
      </Provider>
    )
    
    expect(screen.getByText('Loading..')).toBeInTheDocument()
    expect(screen.queryByTestId('test-page')).not.toBeInTheDocument()
  })

  it('shows page when app is loaded', () => {
    const store = createTestStore({
      settings: {
        isAppLoaded: true,
        isAppLoading: false
      }
    })

    render(
      <Provider store={store}>
        <Loader page={DummyPage} />
      </Provider>
    )
    
    expect(screen.queryByText('Loading..')).not.toBeInTheDocument()
    expect(screen.getByTestId('test-page')).toBeInTheDocument()
    expect(screen.getByText('Nice!')).toBeInTheDocument()
  })
})