'use strict'

import { configureStore as configureStoreRTK } from '@reduxjs/toolkit'
import reducers from '../store'

export default function configureStore (opts = { }) {
  // Setup our store using Redux Toolkit
  const store = configureStoreRTK({
    reducer: reducers,
    preloadedState: opts.initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: ['persist/PERSIST'],
          // Ignore these field paths in all actions
          ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
          // Ignore these paths in the state
          ignoredPaths: ['items.dates'],
        },
      }),
    devTools: import.meta.env.DEV
  })

  if (import.meta.hot) {
    import.meta.hot.accept('../store/index', (newModule) => {
      const _reducers = newModule.default
      store.replaceReducer(_reducers)
    })
  }

  return store
}
