'use strict'

import P from 'bluebird'

import * as backendActions from '../actions/backendActions'
import * as settingsActions from '../actions/settingsActions'

const SENDER_INTERVAL_MS = 500
const SENDER_TIMEOUT = 1500
const MESSAGE_DELAY_MS = 100
const MESSAGE_BUFFER_MAX_SIZE = 100
const REQUEST_TIMEOUT = 10000

let ws = null
let url = null
let senderInterval = null
let buffer = MessageBuffer()
let isSending = false
let store = null

export function connect (opts = { }) {
  const { io } = window
  if (!io) {
    console.error(
      'Ops, `window.io` not set, remember to load the ' +
      'socket.io client (/socket.io/socket.io.js)'
    )
    return
  }
  if (!url && opts.url) {
    url = opts.url
  }
  console.log(`API: Connecting to ${url}`)
  ws = io.connect(url, { jsonp: false })
  setup()
}

export function send (topic, payload) {
  const requestId = getRequestId()
  buffer.add({ topic, payload, requestId })
  return requestId
}

const requests = { }

export function request (topic, payload) {
  const requestId = getRequestId()
  return new P((resolve, reject) => {
    requests[requestId] = { resolve, reject }
    buffer.add({ topic, payload, requestId })
    if (store) {
      store.dispatch(settingsActions.setRequestInProgress(true))
    }
  })
  .tap((response) => (
    console.log('API: Got response: topic=', topic, 'response=', response))
  )
  .timeout(REQUEST_TIMEOUT)
  .catch((reason) => {
    console.log('API: Request error:', reason)
  })
  .finally(() => {
    delete requests[requestId]
    if (store) {
      store.dispatch(settingsActions.setRequestInProgress(false))
    }
  })
}

export function disconnect () {
  ws.disconnect()
  ws = null
}

export function setStore (_store) {
  store = _store
}

function dispatch (payload) {
  if (store) {
    backendActions.receiveBackendEvent(store, payload)
  }
}

function getRequestId () {
  const random = Math.floor(Math.random() * 99999) + 10000
  return random + '_' + Date.now()
}

function sender () {
  // Skip while disconnected, or when there’s nothing to send.
  if (!ws || !ws.connected || !buffer.size()) {
    return
  }
  // Skip when we’re already in the sending.
  if (isSending) {
    return false
  }

  // Keep sending messages in buffer to the server until all
  // messages have been properly acknowledged.
  isSending = true
  console.log('API: Sending ' + buffer.size() + ' messages.')

  const timeout = setTimeout(function () {
    console.log('API: Sender took a break.')
    isSending = false
  }, SENDER_TIMEOUT)

  sendFirst()

  function sendFirst () {
    // Send first message in buffer.
    if (!buffer.size()) {
      return
    }

    // Take a break if we’ve been sending messages for a while already.
    if (!isSending) {
      return
    }

    const message = buffer.first()

    ws.emit('client:message', message, function (ack) {
      if (!ack) {
        console.log('API: No ack response sent.')
        return
      }
      if (ack.requestId !== message.requestId) {
        console.log('API: Ack requestId did not match ours.')
        return
      }

      // Filter out ack’ed message.
      buffer.remove(message)

      if (buffer.size()) {
        // Keep going if there are more messages.
        setTimeout(sendFirst, MESSAGE_DELAY_MS)
      } else {
        // Clean up when we’re done.
        clearTimeout(timeout)
        isSending = false
      }
    })
  }
}

function resolveRequest (data, opts = { reject: false }) {
  if (data.requestId) {
    const request = requests[data.requestId]
    if (request) {
      if (opts.reject) {
        return request.reject(new Error(JSON.stringify(data, null, 2)))
      }
      request.resolve(data)
    }
  }
}

function setup () {
  // Setup on every connect/reconnect.
  ws.on('connect', function () {
    console.log('API: Connected.')
    dispatch({ topic: 'connected' })

    // Start sender.
    if (senderInterval) {
      clearInterval(senderInterval)
    }
    senderInterval = setInterval(sender, SENDER_INTERVAL_MS)
  })

  ws.on('server:message', function (data) {
    console.log('API: Received message, data=', data)
    resolveRequest(data)
    dispatch(data)
  })

  ws.on('server:error', function (error) {
    console.log('API: Server error, message=', error)
    resolveRequest(error, { reject: true })
    dispatch({ topic: 'error', payload: error })
  })

  ws.on('disconnect', function () {
    console.log('API: Disconnected.')
    dispatch({ topic: 'disconnected' })
  })
}

function MessageBuffer () {
  const STORAGE_KEY = '@PlaneraStorage:MessageBuffer'
  const { localStorage } = window
  let messages = []

  loadExisting()

  function loadExisting () {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) {
      try {
        messages = JSON.parse(existing)
        console.log('API: MessageBuffer loaded unsent messages from localStorage:', messages.length)
      } catch (err) {
        console.log('API: MessageBuffer could not parse data in localStorage:', STORAGE_KEY)
        console.log('Data:', existing)
      }
    }
  }

  function persist () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }

  return {
    add (m) {
      messages.push(m)
      if (messages.length > MESSAGE_BUFFER_MAX_SIZE) {
        messages = messages.slice(-MESSAGE_BUFFER_MAX_SIZE)
        console.log('API: MessageBuffer truncated to ' + messages.length + ' messages.')
      }
      persist()
    },

    first () {
      return messages[0]
    },

    remove (m) {
      messages = messages.filter((_m) => _m !== m)
      persist()
    },

    size () {
      return messages.length
    }
  }
}
