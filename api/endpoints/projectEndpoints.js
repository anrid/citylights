import Joi from '@hapi/joi'

import ProjectService from '../services/projectService.js'
import Schemas from './schemas.js'

async function create(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, createProjectSchema)
    const project = await ProjectService.create(valid, context.userId)
    const projectId = project._id.toString()
    
    return {
      topic: 'project:create',
      payload: {
        projectId,
        project
      }
    }
  } catch (error) {
    console.error('Create project failed:', error)
    throw error
  }
}

async function update(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, updateProjectSchema)
    const project = await ProjectService.update(valid.projectId, valid.update, context.userId)
    const projectId = project._id.toString()
    
    return {
      skipSender: true,
      topic: 'project:update',
      payload: {
        projectId,
        project
      }
    }
  } catch (error) {
    console.error('Update project failed:', error)
    throw error
  }
}

async function addMember(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, addOrRemoveMemberSchema)
    const project = await ProjectService.addMember(valid.memberId, valid.projectId, context.userId)
    const projectId = project._id.toString()
    
    return {
      skipSender: true,
      topic: 'project:update',
      payload: {
        projectId,
        project
      }
    }
  } catch (error) {
    console.error('Add project member failed:', error)
    throw error
  }
}

async function removeMember(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, addOrRemoveMemberSchema)
    const project = await ProjectService.removeMember(valid.memberId, valid.projectId, context.userId)
    const projectId = project._id.toString()
    
    return {
      skipSender: true,
      topic: 'project:update',
      payload: {
        projectId,
        project
      }
    }
  } catch (error) {
    console.error('Remove project member failed:', error)
    throw error
  }
}

async function remove(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, removeProjectSchema)
    const project = await ProjectService.remove(valid.projectId, context.userId)
    const projectId = project._id.toString()
    
    return {
      skipSender: true,
      topic: 'project:remove',
      payload: { projectId }
    }
  } catch (error) {
    console.error('Remove project failed:', error)
    throw error
  }
}

const removeProjectSchema = Joi.object().keys({
  projectId: Joi.string().min(20).required().description('Project id.')
})

const addOrRemoveMemberSchema = Joi.object().keys({
  projectId: Joi.string().min(20).required().description('Project id.'),
  memberId: Joi.string().min(20).required().description('Member id.')
})

const createProjectSchema = Joi.object().keys({
  _id: Joi.string().min(20).required().description('Project id, generated on the client.'),
  workspaceId: Joi.string().min(20).required().description('User’s current workspace id.'),
  title: Joi.string().min(3).required().description('Project title.')
})

const updateProjectSchema = Joi.object().keys({
  projectId: Joi.string().min(20).required().description('Project id.'),
  update: Joi.object().keys({
    title: Joi.string().min(3).description('Project title.'),
    desc: Joi.string().min(3).description('Project desc.'),
    isPrivate: Joi.boolean().description('Project privacy setting.'),
    startDate: Joi.date().iso().description('Project start date.'),
    dueDate: Joi.date().iso().description('Project due date.'),
    completedDate: Joi.date().iso().description('Project completed date.'),
    color: Joi.number().description('Project color.')
  }).xor(
    // Force updating one field at a time.
    'title',
    'desc',
    'isPrivate',
    'startDate',
    'dueDate',
    'completedDate',
    'color'
  )
})

export {
  create,
  update,
  addMember,
  removeMember,
  remove
}
