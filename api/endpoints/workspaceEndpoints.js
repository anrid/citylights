'use strict'

const P = require('bluebird')
const Joi = require('joi')

const WorkspaceService = require('../services/workspaceService')
const Schemas = require('./schemas')

function create (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, createWorkspaceSchema)
    return WorkspaceService.create(valid.name, context.userId)
    .then((workspace) => {
      const workspaceId = workspace._id.toString()
      return {
        topic: 'workspace:create',
        payload: {
          workspaceId,
          workspace
        }
      }
    })
  })
}

const createWorkspaceSchema = Joi.object().keys({
  name: Joi.string().min(3).required().description('Workspace name.')
})

module.exports = {
  create
}
