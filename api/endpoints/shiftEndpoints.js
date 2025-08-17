import Joi from '@hapi/joi'

import ShiftService from '../services/shiftService.js'
import Schemas from './schemas.js'

async function create(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, createShiftSchema)
    const shift = await ShiftService.create(valid, context.userId)
    const shiftId = shift._id.toString()
    
    return {
      topic: 'shift:create',
      payload: {
        shiftId,
        shift
      }
    }
  } catch (error) {
    console.error('Create shift failed:', error)
    throw error
  }
}

async function update(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, updateShiftSchema)
    const shift = await ShiftService.update(valid.shiftId, valid.update, context.userId)
    const shiftId = shift._id.toString()
    
    return {
      skipSender: true,
      topic: 'shift:update',
      payload: {
        shiftId,
        shift
      }
    }
  } catch (error) {
    console.error('Update shift failed:', error)
    throw error
  }
}

async function remove(payload, context) {
  try {
    const valid = Schemas.validateOrThrow(payload, removeShiftSchema)
    const shift = await ShiftService.remove(valid.shiftId, context.userId)
    const shiftId = shift._id.toString()
    
    return {
      skipSender: true,
      topic: 'shift:remove',
      payload: { shiftId }
    }
  } catch (error) {
    console.error('Remove shift failed:', error)
    throw error
  }
}

const removeShiftSchema = Joi.object().keys({
  shiftId: Joi.string().min(20).required().description('Shift id.')
})

const createShiftSchema = Joi.object().keys({
  _id: Joi.string().min(20).required().description('Shift id, generated on the client.'),
  projectId: Joi.string().min(20).required().description('Shift project id.'),
  workspaceId: Joi.string().min(20).required().description('User’s current workspace id.'),
  startDate: Joi.date().iso().required().description('Shift start date.'),
  endDate: Joi.date().iso().required().description('Shift end date.'),
  title: Joi.string().min(3).required().description('Shift title.'),
  // Optional.
  assignee: Joi.string().min(20).description('Assignee user id.'),
  color: Joi.number().description('Shift color.')
})

const updateShiftSchema = Joi.object().keys({
  shiftId: Joi.string().min(20).required().description('Shift id.'),
  update: Joi.object().keys({
    title: Joi.string().min(3).description('Shift title.'),
    desc: Joi.string().min(3).description('Shift desc.'),
    isPrivate: Joi.boolean().description('Shift privacy setting.'),
    startDate: Joi.date().iso().description('Shift start date.'),
    endDate: Joi.date().iso().description('Shift end date.'),
    hourRate: Joi.number().description('Shift hourly rate.'),
    color: Joi.number().description('Shift color.'),
    assignee: Joi.string().min(20).description('Assignee user id.')
  }).xor(
    // Force updating one field at a time.
    'title',
    'desc',
    'isPrivate',
    'startDate',
    'endDate',
    'color',
    'hourRate',
    'assignee'
  )
})

export {
  create,
  update,
  remove
}
