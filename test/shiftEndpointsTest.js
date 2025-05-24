'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { describe, it, before } = exports.lab = Lab.script() // Removed expect

const Moment = require('moment')

const Db = require('./databaseHelper.js')
const Shift = require('../api/endpoints/shiftEndpoints.js')

describe('Shift Endpoints', () => {
  let ctx
  let user1
  let user2
  let workspace1Id
  let project1Id
  let shift1

  before(async () => {
    await new Promise(resolve => {
      Db.reset()
      .user('user1')
      .user('user2')
      .workspace('workspace1', 'user1')
      .addToWorkspace('user2', 'workspace1')
      .project('project1', 'workspace1', 'user1')
      .addMemberToProject('user2', 'project1', 'user1')
      .wait((_ctx) => {
        ctx = _ctx
        user1 = { userId: ctx.user1._id.toString() }
        user2 = { userId: ctx.user2._id.toString() }
        workspace1Id = ctx.workspace1._id.toString()
        project1Id = ctx.project1._id.toString()
        resolve()
      })
    })
  })

  it('user1 creates a new shift', async () => {
    const res = await Shift.create({
      _id: Db.getId(),
      title: 'test.test',
      projectId: project1Id,
      workspaceId: workspace1Id,
      startDate: '2016-01-01 10:00',
      endDate: '2016-01-01 18:00'
    }, user1)
    // console.log('result:', res)
    Code.expect(res.topic).to.equal('shift:create')
    Code.expect(res.payload.shift.ownerId).to.equal(user1.userId)
    Code.expect(res.payload.shift.projectId).to.equal(project1Id)
    Code.expect(res.payload.shift.title).to.equal('test.test')
    shift1 = res.payload.shift
  })

  it('user1 updates the shift title', async () => {
    const payload = {
      shiftId: shift1._id.toString(),
      update: { title: 'test.test.update' }
    }
    const res = await Shift.update(payload, user1)
    // console.log('result:', res)
    Code.expect(res.topic).to.equal('shift:update')
    Code.expect(res.payload.shift.title).to.equal(payload.update.title)
  })

  it('user1 updates the shift start date in various ways', async () => {
    const payload = {
      shiftId: shift1._id.toString(),
      update: { startDate: '2016-06-01' }
    }
    let res = await Shift.update(payload, user1)
    // console.log('result:', res)
    Code.expect(res.payload.shift.startDate.toJSON()).to.include('2016-06-01')

    try {
      payload.update = { startDate: '16 May 2016' }
      await Shift.update(payload, user1)
      throw new Error('Expected validation error!')
    } catch (reason) {
      Code.expect(reason.output.payload.message).to.include('must be in ISO 8601 date format')
    }

    payload.update = { startDate: '2016-05-10T10:00:00.500Z' }
    res = await Shift.update(payload, user1)
    // console.log('result:', res)
    Code.expect(res.payload.shift.startDate.toJSON()).to.include('2016-05-10T10:00:00.500Z')
  })

  it('user1 assigns user2 to shift', async () => {
    const payload = {
      shiftId: shift1._id.toString(),
      update: { assignee: user2.userId }
    }
    const res = await Shift.update(payload, user1)
    // console.log('result:', res.payload.shift)
    Code.expect(res.topic).to.equal('shift:update')
    Code.expect(res.payload.shift.assignee).to.equal(user2.userId)
  })

  it('user2 fails to update shift since he’s not a project admin nor the shift owner', async () => {
    const payload = {
      shiftId: shift1._id.toString(),
      update: { title: 'whaT-Ev-eeehr.' }
    }
    try {
      await Shift.update(payload, user2)
      throw new Error('Expected operation to throw!')
    } catch (reason) {
      // console.log('reason=', reason)
      Code.expect(reason.output.payload.message).to.include('Is not project owner or admin')
    }
  })

  it('user2 fails to delete shift since he’s not a project admin nor the shift owner', async () => {
    const payload = { shiftId: shift1._id.toString() }
    try {
      await Shift.remove(payload, user2)
      throw new Error('Expected operation to throw!')
    } catch (reason) {
      Code.expect(reason.output.payload.message).to.include('Is not project owner or admin')
    }
  })

  it('user1 deletes shift', async () => {
    const payload = { shiftId: shift1._id.toString() }
    const res = await Shift.remove(payload, user1)
    Code.expect(res.topic).to.equal('shift:remove')
    Code.expect(res.payload.shiftId).to.equal(shift1._id.toString())
  })
})
