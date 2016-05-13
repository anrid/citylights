'use strict'

const P = require('bluebird')
const Redis = require('redis')
const Assert = require('assert')

const REDIS_BUS_MESSAGE = 'REDIS_BUS_MESSAGE'
const REDIS_BUS_REPLY_TIMEOUT = 3000

P.promisifyAll(Redis.RedisClient.prototype)
P.promisifyAll(Redis.Multi.prototype)

const Pub = Redis.createClient()
const Sub = Redis.createClient()

const subscriptions = { }
const requests = { }
const options = {
  debug: false
}

let serviceId

/*
 * Perform a request expecting a response within
 * ${REDIS_BUS_REPLY_TIMEOUT} ms.
 */
function request (topic, payload) {
  const requestId = getRequestId()
  return new P((resolve, reject) => {
    requests[requestId] = { resolve, reject }
    publish(topic, payload || { }, requestId)
  })
  .timeout(REDIS_BUS_REPLY_TIMEOUT)
  // Tap the error so that we can dump it to console.
  .catch((reason) => {
    error(reason)
    if (reason.payload) {
      log(JSON.stringify(reason, null, 2))
    }
    return P.reject(reason)
  })
  .finally(() => {
    delete requests[requestId]
  })
}

/*
 * Publish a message on the bus.
 */
function publish (topic, payload, requestId) {
  Pub.publish(REDIS_BUS_MESSAGE, JSON.stringify({
    source: serviceId,
    requestId,
    topic,
    payload: payload || { }
  }))
}

/*
 * Publish a message on the bus based on the current request.
 * The original `requestId` is propagated.
 */
function reply (request, payload) {
  publish(`${request.topic}:result`, payload, request.requestId)
}

/*
 * Publish an error on the bus based on the current request.
 * The original `requestId` is propagated.
 */
function replyError (request, payload) {
  publish(`${request.topic}:error`, payload, request.requestId)
}

/*
 * Subscribe to a given topic.
 */
function subscribe (topic, handler) {
  if (!subscriptions[topic]) {
    subscriptions[topic] = []
  }
  subscriptions[topic].push(handler)
}

/*
  Create an endpoint expecting a typical request/reply flow.
  A typical endpoint would look like this;

  Bus.endpoint({
    // Some topic to respond to.
    topic: 'turbo:urbo',

    // Handler function implemented as a generator.
    handler: function * (request, payload) {
      const turbo = yield SomeService.getTurboForUser(payload.userId)
      let message = 'This user hasn’t gone Turbo yet.'
      if (!turbo) {
        message: 'This user has GONE TURBO!'
      }
      return { turbo, message }
    }
  })
 */
function endpoint (opts) {
  Assert(opts.topic, 'Missing `opts.topic`')
  Assert(opts.handler, 'Missing `opts.handler`')
  const _handler = function (request) {
    return P.try(() => {
      return P.coroutine(opts.handler)(request, request.payload)
      .then((result) => reply(request, result))
      .catch((reason) => {
        console.error(reason.message || reason)
        console.error(reason.stack)
        replyError(request, { error: reason.message || reason.toString() })
      })
    })
  }
  subscribe(opts.topic, _handler)
}

/*
 * Log, if debug flag is set.
 */
function log () {
  if (options.debug) {
    console.log(`[${serviceId}] Bus:`, ...arguments)
  }
}

/*
 * Error log.
 */
function error () {
  console.error(`[${serviceId}] Bus error:`,
    JSON.stringify(arguments, null, 2)
  )
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function getRequestId () {
  return Date.now() + '.' + getRandomInt(100000, 1000000)
}

module.exports = function connect (_serviceId, _options) {
  serviceId = _serviceId
  Object.assign(options, _options || { })

  Sub.on('error', error)

  Sub.on('message', (channel, message) => {
    try {
      const json = JSON.parse(message)
      Assert(json.source, 'Message is missing `source`')
      Assert(json.topic, 'Message is missing `topic`')
      Assert(json.payload, 'Message is missing `payload`')

      // Skip all messages from this service.
      if (json.source === serviceId) {
        return
      }

      // Handle replies to requests previously sent from this service.
      const request = requests[json.requestId]
      if (json.requestId && request) {
        // Error topics end with `:error`, e.g. 'user:create:error'
        if (json.topic.indexOf(':error') !== -1) {
          log('received reply error=', json)
          request.reject(json)
          return
        }

        log('received reply=', json)
        request.resolve(json)
        return
      }

      // Notify all matching subscribers.
      if (subscriptions[json.topic]) {
        subscriptions[json.topic].map((handler) => {
          log('handle message=', json)
          handler(json)
        })
      }
    } catch (err) {
      error(err)
    }
  })

  Sub.on('subscribe', (channel, count) => {
    publish(`connect:${serviceId}`, { message: `${serviceId} service connected.` })
    console.log(`[${serviceId}] Bus: connected.`)
  })

  Sub.subscribe(REDIS_BUS_MESSAGE)

  return {
    request,
    reply,
    replyError,
    publish,
    subscribe,
    endpoint
  }
}
