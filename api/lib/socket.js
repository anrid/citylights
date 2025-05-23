'use strict'

const Boom = require('@hapi/boom')
const P = require('bluebird')
const Hoek = require('@hapi/hoek')
const SocketIO = require('socket.io')
const Moment = require('moment')

const socketEndpoints = require('../endpoints')
const Audit = require('./auditLog')

function handleClientMessage (topic, payload, userId) {
  return P.try(() => {
    const endpoint = socketEndpoints[topic]
    if (!endpoint) {
      throw Boom.notFound(`Missing endpoint for topic '${topic}'`)
    }

    // Restrict access unless explicity stated that this endpoint is open
    // to the public.
    if (endpoint.auth !== false) {
      if (!userId) {
        throw Boom.notFound(`Not authenticated, cannot access endpoint for '${topic}'`)
      }
    }

    return P.resolve(endpoint.func(payload, { userId }))
    .tap((response) => {
      // Audit all the things, assuming request was successful.
      if (endpoint.audit !== false) {
        Audit.log(userId, topic, payload)
      }
    })
  })
}

function getErrorHandler (message, socket) {
  return (error) => {
    // Send back some error message that makes sense.
    const response = {
      requestId: message.requestId
    }
    // Handle all Boom errors.
    if (error.isBoom) {
      response.error = error.output.payload
      response.code = error.output.statusCode
    // Handle other shiz..
    } else {
      response.error = error.toString()
    }
    console.error('Socket API error:', error)
    console.error('Stack:', error.stack)
    console.error('Caused by message:', message)

    socket.emit('server:error', response)
  }
}

function authenticateSocket (socket) {
  return (response) => {
    Hoek.assert(response.payload.identity.userId, 'Auth response missing `identity.userId`')
    Hoek.assert(response.payload.info.email, 'Auth response missing `info.email`')

    // Authenticate socket connection for this user.
    socket.userId = response.payload.identity.userId
    socket.email = response.payload.info.email

    console.log(`API: authenticated socket for ${socket.userId} (${socket.email}).`)

    socket.emit('server:auth', response)
  }
}

function setupSocketHandlers (socket) {
  console.log('Socket connected:', socket.id)

  // Handle API calls.
  socket.on('client:message', (message, ack) => {
    return P.try(() => {
      Hoek.assert(message.topic, 'missing `topic` prop')
      Hoek.assert(message.payload, 'missing `payload` prop')
      Hoek.assert(message.requestId, 'missing `requestId` prop')

      // Log it.
      const id = socket.userId || socket.id
      console.log('API: client message, topic=', message.topic, id, Moment().format())

      if (ack) {
        // Ack incoming message.
        ack({
          topic: message.topic + ':ack',
          requestId: message.requestId || 'n/a'
        })
      }

      // Handle incoming message.
      // NOTE: Adds userId as final argument if client is authenticated.
      return handleClientMessage(message.topic, message.payload, socket.userId)
    })
    .then((response) => {
      // Include the original request id always.
      response.requestId = message.requestId

      // On successful authentication; Upgrade socket reference to `authenticated`
      // status on both server and client.
      if (response.topic === 'auth:successful' ||
          response.topic === 'auth:token:successful') {
        authenticateSocket(socket)(response)
      }

      if (response.skipSender) {
        // Do not broadcast a full payload to the sender as they’ve already
        // performed an optimistic update.
        // Send a simple acknowledgement instead.
        const newResponse = {
          topic: response.topic + ':response',
          requestId: message.requestId
        }
        socket.emit('server:message', newResponse)
        return
      }

      // TODO: Broadcast as needed.

      // Finally, respond.
      socket.emit('server:message', response)
    })
    .catch(getErrorHandler(message, socket))
  })
}

module.exports = function (server) {
  const io = SocketIO.listen(server.listener)
  io.on('connection', setupSocketHandlers)
  console.log('Setup SocketIO.')
}
