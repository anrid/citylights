import React from 'react'
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../../lib/testUtils.modern'

import Loader from '../Loader'

// Simple test component
function DummyPage() {
  return <div data-testid="test-page">Nice!</div>
}

describe('Loader', () => {
  it('shows loader while app isn\'t loaded', () => {
    render(<Loader page={DummyPage} />, {
      initialState: {
        settings: {
          isAppLoaded: false,
          isAppLoading: true
        }
      }
    })
    
    expect(screen.getByText('Loading..')).toBeInTheDocument()
    expect(screen.queryByTestId('test-page')).not.toBeInTheDocument()
  })

  it('shows page when app is loaded', () => {
    render(<Loader page={DummyPage} />, {
      initialState: {
        settings: {
          isAppLoaded: true,
          isAppLoading: false
        }
      }
    })
    
    expect(screen.queryByText('Loading..')).not.toBeInTheDocument()
    expect(screen.getByTestId('test-page')).toBeInTheDocument()
    expect(screen.getByText('Nice!')).toBeInTheDocument()
  })
})