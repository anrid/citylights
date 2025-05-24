'use strict'

const Boom = require('@hapi/boom')
const Joi = require('joi')

function validateOrThrow (data, schema) {
  if (!data) {
    throw Boom.badRequest('Missing data')
  }
  // For Joi v16+ the syntax is schema.validate(value, [options])
  const result = schema.validate(data, { stripUnknown: true })
  if (result.error) {
    const e = Boom.badRequest('Validation error')
    e.output.payload.message = result.error.details.map((x) => x.message).join(', ')
    e.output.payload.details = result.error.details.reduce((acc, x) => {
      acc[x.path] = x.message
      return acc
    }, { })
    throw e
  }
  return result.value
}

module.exports = {
  validateOrThrow
}
