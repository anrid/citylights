import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../../planner/Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const buttonElement = screen.getByText('Click me')
    fireEvent.click(buttonElement)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies default button classes', () => {
    render(<Button>Test</Button>)
    const buttonElement = screen.getByText('Test')
    expect(buttonElement).toHaveClass('pl-time-planner-button')
    expect(buttonElement).toHaveClass('pl-time-planner-button--default')
  })

  it('applies primary kind class', () => {
    render(<Button kind="primary">Primary button</Button>)
    const buttonElement = screen.getByText('Primary button')
    expect(buttonElement).toHaveClass('pl-time-planner-button--primary')
  })

  it('applies warning kind class', () => {
    render(<Button kind="warning">Warning button</Button>)
    const buttonElement = screen.getByText('Warning button')
    expect(buttonElement).toHaveClass('pl-time-planner-button--warning')
  })

  it('renders children correctly', () => {
    render(
      <Button>
        <span data-testid="child-element">Child content</span>
      </Button>
    )
    expect(screen.getByTestId('child-element')).toBeInTheDocument()
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })
})