
const Boom = require('boom')
const P = require('bluebird')
const Hoek = require('hoek')
const SocketIO = require('socket.io')
const Moment = require('moment')

const socketEndpoints = require('./endpoints')

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
  })
}

function setupSocketHandlers (socket) {
  console.log('Socket connected:', socket.id)

  socket.on('client:message', (message, ack) => {
    return P.try(() => {
      Hoek.assert(message.topic, 'missing `topic` prop')
      Hoek.assert(message.payload, 'missing `payload` prop')
      Hoek.assert(message.requestId, 'missing `requestId` prop')

      // Log it.
      const id = socket.userId || socket.id
      console.log('API: client message, topic=', message.topic, id, Moment().format())

      // Ack incoming message.
      ack({
        topic: message.topic + ':ack',
        requestId: message.requestId || 'n/a'
      })

      // Handle incoming message.
      // NOTE: Adds userId as final argument if client is authenticated.
      return handleClientMessage(message.topic, message.payload, socket.userId)
    })
    .then((response) => {
      // Handle certain response topics.
      if (response.topic === 'auth:successful') {
        // Authenticate socket connection for this user.
        socket.userId = response.payload.userId
        socket.email = response.payload.email
        console.log(`API: authenticated socket for ${socket.userId} (${socket.email}).`)
      }

      // Send response.
      response.requestId = message.requestId
      socket.emit('server:message', response)
    })
    .catch((error) => {
      // Send back some error message that makes sense.
      const response = {
        requestId: message.requestId
      }
      // Handle all Boom errors.
      if (error.isBoom) {
        response.error = error.output.payload
        response.code = error.output.statusCode
      // Handle other shiz.
      } else {
        response.error = error.toString()
      }
      console.error('Socket API error:', error)
      console.error('Stack:', error.stack)
      console.error('Caused by message:', message)

      socket.emit('server:error', response)
    })
  })
}

module.exports = function (server) {
  const io = SocketIO.listen(server.listener)
  io.on('connection', setupSocketHandlers)
  console.log('Setup SocketIO.')
}
