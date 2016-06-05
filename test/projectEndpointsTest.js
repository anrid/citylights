'use strict'

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const Db = require('./databaseHelper.js')
const Project = require('../api/endpoints/projectEndpoints.js')

lab.experiment('Project Endpoints', () => {
  let ctx
  let user1
  let user2
  let workspace1Id
  let project1

  lab.before((done) => {
    Db.reset()
    .user('user1')
    .user('user2')
    .workspace('workspace1', 'user1')
    .addToWorkspace('user2', 'workspace1')
    .wait((_ctx) => {
      ctx = _ctx
      user1 = { userId: ctx.user1._id.toString() }
      user2 = { userId: ctx.user2._id.toString() }
      workspace1Id = ctx.workspace1._id.toString()
      done()
    })
  })

  lab.test('user1 creates a new project', () => {
    return Project.create({
      _id: Db.getId(),
      title: 'test.test',
      workspaceId: workspace1Id
    }, user1)
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('project:create')
      Code.expect(res.payload.project.ownerId).to.equal(user1.userId)
      Code.expect(res.payload.project.admins[0]).to.equal(user1.userId)
      Code.expect(res.payload.project.title).to.equal('test.test')
      project1 = res.payload.project
    })
  })

  lab.test('user1 updates the project title', () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { title: 'test.test.update' }
    }
    return Project.update(payload, user1)
    .tap((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('project:update')
      Code.expect(res.payload.project.title).to.equal(payload.update.title)
    })
  })

  lab.test('user1 updates the project start date in various ways', () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { startDate: '2016-06-01' }
    }
    return Project.update(payload, user1)
    .tap((res) => {
      // console.log('result:', res)
      Code.expect(res.payload.project.startDate.toJSON()).to.include('2016-06-01')
    })
    .then(() => {
      payload.update = { startDate: '16 May 2016' }
      return Project.update(payload, user1)
    })
    .tap(() => Code.fail('Expected validation error!'))
    .catch((reason) => {
      Code.expect(reason.output.payload.message).to.include('valid ISO 8601')
    })
    .then((res) => {
      payload.update = { startDate: '2016-05-10T10:00:00.500Z' }
      return Project.update(payload, user1)
    })
    .tap((res) => {
      // console.log('result:', res)
      Code.expect(res.payload.project.startDate.toJSON()).to.include('2016-05-10T10:00:00.500Z')
    })
  })

  lab.test('user1 adds user2 as a project member', () => {
    const payload = {
      projectId: project1._id.toString(),
      memberId: user2.userId
    }
    return Project.addMember(payload, user1)
    .tap((res) => {
      // console.log('result:', res.payload.project)
      Code.expect(res.topic).to.equal('project:update')
      Code.expect(res.payload.project.members.length).to.equal(1)
      Code.expect(res.payload.project.members[0]).to.equal(user2.userId)
    })
  })

  lab.test('user2 updates the project title as a newly added project member', () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { title: 'test.test.update2' }
    }
    return Project.update(payload, user2)
    .tap((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('project:update')
      Code.expect(res.payload.project.title).to.equal(payload.update.title)
    })
  })

  lab.test('user1 removes user2 from project', () => {
    const payload = {
      projectId: project1._id.toString(),
      memberId: user2.userId
    }
    return Project.removeMember(payload, user1)
    .tap((res) => {
      // console.log('result:', res.payload.project)
      Code.expect(res.topic).to.equal('project:update')
      Code.expect(res.payload.project.members.length).to.equal(0)
      Code.expect(res.payload.project.admins[0]).to.equal(user1.userId)
    })
  })

  lab.test('user2 fails to update project title since he’s no longer a member', () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { title: 'test.test.update3' }
    }
    return Project.update(payload, user2)
    .tap((res) => Code.fail('Expected operation to throw!'))
    .catch((reason) => {
      // console.log('result:', reason)
      Code.expect(reason.output.payload.message).to.include('Cannot find a valid project')
    })
  })
})
