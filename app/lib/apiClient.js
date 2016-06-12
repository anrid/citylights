'use strict'

import P from 'bluebird'

const SENDER_INTERVAL_MS = 500
const SENDER_TIMEOUT = 1500
const MESSAGE_DELAY_MS = 100
const MESSAGE_BUFFER_MAX_SIZE = 100
const REQUEST_TIMEOUT = 10000

let _ws = null
let _url = null
let _senderInterval = null
let _buffer = MessageBuffer()
let _isSending = false
let _listeners = []
let _isAuthenticated = false
let _accessToken = null

export function connect (opts = { }) {
  const { io } = window
  if (!io) {
    console.error(
      'Ops, `window.io` not set, remember to load the ' +
      'socket.io client (/socket.io/socket.io.js)'
    )
    return
  }
  if (!_url && opts.url) {
    _url = opts.url
  }
  if (opts.accessToken) {
    _accessToken = opts.accessToken
  }

  _isAuthenticated = false
  _isSending = false

  console.log(`API: Connecting to ${_url}`)
  _ws = io.connect(_url, { jsonp: false })
  setup()
}

export function send (topic, payload) {
  const requestId = getRequestId()
  _buffer.add({ topic, payload, requestId })
  return requestId
}

const requests = { }

export function authenticate (email, password) {
  _ws.emit('client:auth', { email, password })
}

export function request (topic, payload, opts = { }) {
  const requestId = getRequestId()
  return new P((resolve, reject) => {
    requests[requestId] = { resolve, reject }
    const message = { topic, payload, requestId }

    // Check if this is a public API call.
    if (opts.requireAuth === false) {
      console.log('API: Emitting unbuffered public API message:', message)
      // Emit an unbuffered message without waiting for acknowledgement.
      _ws.emit('client:message', message)
      return
    }

    // Buffer message to be sent later.
    _buffer.add(message)
  })
  .timeout(REQUEST_TIMEOUT)
  .catch((reason) => {
    console.log('API: Request error:', reason)
    throw reason
  })
  .finally(() => {
    // console.log('API: Deleted request id:', requestId)
    delete requests[requestId]
  })
}

export function disconnect () {
  _ws.disconnect()
  _ws = null
}

export function addEventListener (func) {
  _listeners.push(func)
}

function publish (event) {
  if (_listeners && _listeners.length) {
    _listeners.forEach((func) => func(event))
  }
}

function getRequestId () {
  const random = Math.floor(Math.random() * 99999) + 10000
  return random + '_' + Date.now()
}

function sender () {
  // Skip while disconnected, or when there’s nothing to send.
  if (!_ws || !_ws.connected || !_buffer.size()) {
    return
  }
  // Skip when we’re already in the sending.
  if (_isSending) {
    return false
  }

  // Keep sending messages in buffer to the server until all
  // messages have been properly acknowledged.
  _isSending = true
  console.log('API: Sending ' + _buffer.size() + ' messages.')

  const timeout = setTimeout(function () {
    console.log('API: Sender took a break.')
    _isSending = false
  }, SENDER_TIMEOUT)

  sendFirst()

  function sendFirst () {
    // Send first message in buffer.
    if (!_buffer.size()) {
      return
    }

    // Take a break if we’ve been sending messages for a while already.
    if (!_isSending) {
      return
    }

    // Assume buffered messages are important API calls that require
    // a valid session !
    if (!_isAuthenticated) {
      console.log(`API: Socket is not authenticated, taking a chill pill with ${_buffer.size()} messages in buffer.`)
      return
    }

    const message = _buffer.first()

    _ws.emit('client:message', message, function (ack) {
      if (!ack) {
        console.log('API: No ack response sent.')
        return
      }
      if (ack.requestId !== message.requestId) {
        console.log('API: Ack requestId did not match ours.')
        return
      }

      // Filter out ack’ed message.
      _buffer.remove(message)

      if (_buffer.size()) {
        // Keep going if there are more messages.
        setTimeout(sendFirst, MESSAGE_DELAY_MS)
      } else {
        // Clean up when we’re done.
        clearTimeout(timeout)
        _isSending = false
      }
    })
  }
}

function resolveRequest (data, opts = { reject: false }) {
  if (data.requestId) {
    const request = requests[data.requestId]
    if (request) {
      if (opts.reject) {
        const error = new Error('Server error')
        error.info = data
        request.reject(error)
        return
      }
      request.resolve(data)
    }
  }
}

function setup () {
  // Setup on every connect/reconnect.
  _ws.on('connect', function () {
    console.log('API: Connected.')
    publish({ topic: 'connected' })

    if (_accessToken) {
      console.log('API: Found access token, authenticating ..')
      _ws.emit('client:auth:token', { accessToken: _accessToken })
    }

    // Start sender.
    if (_senderInterval) {
      clearInterval(_senderInterval)
    }
    _senderInterval = setInterval(sender, SENDER_INTERVAL_MS)
  })

  _ws.on('server:auth', function (data) {
    console.log('API: Socket is authenticated.')
    _isAuthenticated = true
    resolveRequest(data)
    publish(data)
  })

  _ws.on('server:message', function (data) {
    resolveRequest(data)
    publish(data)
  })

  _ws.on('server:error', function (error) {
    resolveRequest(error, { reject: true })
    publish({ topic: 'error', payload: error })
  })

  _ws.on('disconnect', function () {
    console.log('API: Disconnected.')
    publish({ topic: 'disconnected' })
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
