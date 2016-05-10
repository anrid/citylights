'use strict'

import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducers'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

export default function configureStore (opts = { }) {
  // Setup our store.
  const reducer = combineReducers(reducers)
  const store = createStore(
    reducer,
    opts.initialState,
    applyMiddleware(thunk, routerMiddleware(hashHistory))
  )

  if (module.hot) {
    module.hot.accept(() => {
      const _reducers = require('../reducers/index').default
      const nextRootReducer = combineReducers(_reducers)
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
