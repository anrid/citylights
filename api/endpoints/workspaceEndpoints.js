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

function update (payload, context) {
  return P.try(() => {
    const valid = Schemas.validateOrThrow(payload, updateWorkspaceSchema)
    return WorkspaceService.update(valid.workspaceId, valid.update, context.userId)
    .then((workspace) => {
      const workspaceId = workspace._id.toString()
      return {
        topic: 'workspace:update',
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

const updateWorkspaceSchema = Joi.object().keys({
  workspaceId: Joi.string().min(20).required().description('User’s current workspace id.'),
  update: Joi.object().keys({
    name: Joi.string().min(3).description('Workspace name.'),
    domain: Joi.string().min(3).description('Workspace domain.')
  }).xor('name', 'domain') // Force updating one field at a time.
})

module.exports = {
  create,
  update
}
