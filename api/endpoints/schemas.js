import Boom from '@hapi/boom'
import Joi from 'joi'

function validateOrThrow (data, schema) {
  if (!data) {
    throw Boom.badRequest('Missing data')
  }
  
  // Joi v18+ syntax
  const { error, value } = schema.validate(data, { stripUnknown: true })
  if (error) {
    const e = Boom.badRequest('Validation error')
    e.output.payload.message = error.details.map((x) => x.message).join(', ')
    e.output.payload.details = error.details.reduce((acc, x) => {
      acc[x.path] = x.message
      return acc
    }, { })
    throw e
  }
  return value
}

export default {
  validateOrThrow
}
