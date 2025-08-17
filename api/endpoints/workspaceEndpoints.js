import Joi from '@hapi/joi'

import WorkspaceService from '../services/workspaceService.js'
import Schemas from './schemas.js'

async function create(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, createWorkspaceSchema)
    const workspace = await WorkspaceService.create(valid.name, context.userId)
    const workspaceId = workspace._id.toString()
    
    return {
      topic: 'workspace:create',
      payload: {
        workspaceId,
        workspace
      }
    }
  } catch (error) {
    console.error('Create workspace failed:', error)
    throw error
  }
}

async function update(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, updateWorkspaceSchema)
    const workspace = await WorkspaceService.update(valid.workspaceId, valid.update, context.userId)
    const workspaceId = workspace._id.toString()
    
    return {
      topic: 'workspace:update',
      payload: {
        workspaceId,
        workspace
      }
    }
  } catch (error) {
    console.error('Update workspace failed:', error)
    throw error
  }
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

export {
  create,
  update
}
