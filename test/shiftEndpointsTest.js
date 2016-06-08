'use strict'

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const Moment = require('moment')

const Db = require('./databaseHelper.js')
const Shift = require('../api/endpoints/shiftEndpoints.js')

lab.experiment('Shift Endpoints', () => {
  let ctx
  let user1
  let user2
  let workspace1Id
  let project1Id
  let shift1

  lab.before((done) => {
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
      done()
    })
  })

  lab.test('user1 creates a new shift', () => {
    return Shift.create({
      _id: Db.getId(),
      title: 'test.test',
      projectId: project1Id,
      workspaceId: workspace1Id,
      startDate: '2016-01-01 10:00',
      endDate: '2016-01-01 18:00'
    }, user1)
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('shift:create')
      Code.expect(res.payload.shift.ownerId).to.equal(user1.userId)
      Code.expect(res.payload.shift.projectId).to.equal(project1Id)
      Code.expect(res.payload.shift.title).to.equal('test.test')
      shift1 = res.payload.shift
    })
  })

  lab.test('user1 updates the shift title', () => {
    const payload = {
      shiftId: shift1._id.toString(),
      update: { title: 'test.test.update' }
    }
    return Shift.update(payload, user1)
    .tap((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('shift:update')
      Code.expect(res.payload.shift.title).to.equal(payload.update.title)
    })
  })

  lab.test('user1 updates the shift start date in various ways', () => {
    const payload = {
      shiftId: shift1._id.toString(),
      update: { startDate: '2016-06-01' }
    }
    return Shift.update(payload, user1)
    .tap((res) => {
      // console.log('result:', res)
      Code.expect(res.payload.shift.startDate.toJSON()).to.include('2016-06-01')
    })
    .then(() => {
      payload.update = { startDate: '16 May 2016' }
      return Shift.update(payload, user1)
    })
    .tap(() => Code.fail('Expected validation error!'))
    .catch((reason) => {
      Code.expect(reason.output.payload.message).to.include('valid ISO 8601')
    })
    .then((res) => {
      payload.update = { startDate: '2016-05-10T10:00:00.500Z' }
      return Shift.update(payload, user1)
    })
    .tap((res) => {
      // console.log('result:', res)
      Code.expect(res.payload.shift.startDate.toJSON()).to.include('2016-05-10T10:00:00.500Z')
    })
  })

  lab.test('user1 assigns user2 to shift', () => {
    const payload = {
      shiftId: shift1._id.toString(),
      update: { assignee: user2.userId }
    }
    return Shift.update(payload, user1)
    .tap((res) => {
      // console.log('result:', res.payload.shift)
      Code.expect(res.topic).to.equal('shift:update')
      Code.expect(res.payload.shift.assignee).to.equal(user2.userId)
    })
  })

  lab.test('user2 fails to update shift since he’s not a project admin nor the shift owner', () => {
    const payload = {
      shiftId: shift1._id.toString(),
      update: { title: 'whaT-Ev-eeehr.' }
    }
    return Shift.update(payload, user2)
    .tap((res) => Code.fail('Expected operation to throw!'))
    .catch((reason) => {
      // console.log('reason=', reason)
      Code.expect(reason.output.payload.message).to.include('Is not project owner or admin')
    })
  })

  lab.test('user2 fails to delete shift since he’s not a project admin nor the shift owner', () => {
    const payload = { shiftId: shift1._id.toString() }
    return Shift.remove(payload, user2)
    .tap((res) => Code.fail('Expected operation to throw!'))
    .catch((reason) => {
      Code.expect(reason.output.payload.message).to.include('Is not project owner or admin')
    })
  })

  lab.test('user1 deletes shift', () => {
    const payload = { shiftId: shift1._id.toString() }
    return Shift.remove(payload, user1)
    .tap((res) => {
      Code.expect(res.topic).to.equal('shift:remove')
      Code.expect(res.payload.shiftId).to.equal(shift1._id.toString())
    })
  })
})
