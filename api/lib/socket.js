import Boom from '@hapi/boom'
import * as Hoek from '@hapi/hoek'
import { Server as SocketIOServer } from 'socket.io'
import moment from 'moment'

import socketEndpoints from '../endpoints/index.js'
import Audit from './auditLog.js'

async function handleClientMessage(topic, payload, userId) {
  console.log('handleClientMessage called:', { topic, userId, payload: payload ? 'present' : 'null' })
  try {
    const endpoint = socketEndpoints[topic]
    if (!endpoint) {
      throw Boom.notFound(`Missing endpoint for topic '${topic}'`)
    }

    // Restrict access unless explicitly stated that this endpoint is open
    // to the public.
    if (endpoint.auth !== false) {
      if (!userId) {
        throw Boom.notFound(`Not authenticated, cannot access endpoint for '${topic}'`)
      }
    }

    const response = await endpoint.func(payload, { userId })
    
    // Audit all the things, assuming request was successful.
    if (endpoint.audit !== false) {
      await Audit.log(userId, topic, payload)
    }
    
    return response
  } catch (error) {
    console.error('Handle client message error:', error)
    throw error
  }
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

function setupSocketHandlers(socket) {
  console.log('Socket connected:', socket.id)

  // Handle API calls.
  socket.on('client:message', async (message, ack) => {
    try {
      Hoek.assert(message.topic, 'missing `topic` prop')
      Hoek.assert(message.payload, 'missing `payload` prop')
      Hoek.assert(message.requestId, 'missing `requestId` prop')

      // Log it.
      const id = socket.userId || socket.id
      console.log('API: client message, topic=', message.topic, id, moment().format())

      if (ack) {
        // Ack incoming message.
        ack({
          topic: message.topic + ':ack',
          requestId: message.requestId || 'n/a'
        })
      }

      // Handle incoming message.
      // NOTE: Adds userId as final argument if client is authenticated.
      console.log('About to call handleClientMessage:', { topic: message.topic, userId: socket.userId })
      const response = await handleClientMessage(message.topic, message.payload, socket.userId)
      
      // Include the original request id always.
      response.requestId = message.requestId

      // On successful authentication; Upgrade socket reference to `authenticated`
      // status on both server and client.
      if (response.topic === 'auth:successful' ||
          response.topic === 'auth:token:successful') {
        authenticateSocket(socket)(response)
      }

      if (response.skipSender) {
        // Do not broadcast a full payload to the sender as they've already
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
    } catch (error) {
      getErrorHandler(message, socket)(error)
    }
  })
}

// Modern Socket.io v4 setup
export default function setupSocket(server) {
  const io = new SocketIOServer(server.listener, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })
  
  io.on('connection', setupSocketHandlers)
  console.log('Setup SocketIO v4.')
  return io
}
