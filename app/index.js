'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './containers/App'

window.onload = function () {
  ReactDOM.render(<App />, document.getElementById('pl-app'), () => {
    console.log('App rendered to the DOM.')
    const loader = document.querySelector('.pl-app-loader')
    loader.style.display = 'none'
  })
}
