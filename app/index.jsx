'use strict'

import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './containers/App.jsx'

// Load socket.io dynamically
const loadSocketIO = () => {
  return new Promise((resolve, reject) => {
    if (window.io) {
      resolve(window.io)
      return
    }
    
    const script = document.createElement('script')
    script.src = `${window.Config.API_URL}/socket.io/socket.io.js`
    script.onload = () => resolve(window.io)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

window.onload = async function () {
  try {
    // Mount React app first
    const container = document.getElementById('pl-app')
    const root = createRoot(container)
    
    root.render(<App />)
    
    console.log('App rendered to the DOM.')
    const loader = document.querySelector('.pl-app-loader')
    if (loader) {
      loader.style.display = 'none'
    }
    
    // Try to load socket.io in background (non-blocking)
    loadSocketIO().catch(error => {
      console.warn('Socket.io not available:', error.message)
    })
  } catch (error) {
    console.error('Failed to initialize app:', error)
  }
}
