'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { describe, it, before, expect } = exports.lab = Lab.script()

const Db = require('./databaseHelper.js')
const Project = require('../api/endpoints/projectEndpoints.js')

describe('Project Endpoints', () => {
  let ctx
  let user1
  let user2
  let workspace1Id
  let project1

  before(async () => {
    await new Promise(resolve => {
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
        resolve()
      })
    })
  })

  it('user1 creates a new project', async () => {
    const res = await Project.create({
      _id: Db.getId(),
      title: 'test.test',
      workspaceId: workspace1Id
    }, user1)
    // console.log('result:', res)
    expect(res.topic).to.equal('project:create')
    expect(res.payload.project.ownerId).to.equal(user1.userId)
    expect(res.payload.project.admins[0]).to.equal(user1.userId)
    expect(res.payload.project.title).to.equal('test.test')
    project1 = res.payload.project
  })

  it('user1 updates the project title', async () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { title: 'test.test.update' }
    }
    const res = await Project.update(payload, user1)
    // console.log('result:', res)
    expect(res.topic).to.equal('project:update')
    expect(res.payload.project.title).to.equal(payload.update.title)
  })

  it('user1 updates the project start date in various ways', async () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { startDate: '2016-06-01' }
    }
    let res = await Project.update(payload, user1)
    // console.log('result:', res)
    expect(res.payload.project.startDate.toJSON()).to.include('2016-06-01')

    try {
      payload.update = { startDate: '16 May 2016' }
      await Project.update(payload, user1)
      throw new Error('Expected validation error!') // Replaces Code.fail
    } catch (reason) {
      expect(reason.output.payload.message).to.include('valid ISO 8601')
    }

    payload.update = { startDate: '2016-05-10T10:00:00.500Z' }
    res = await Project.update(payload, user1)
    // console.log('result:', res)
    expect(res.payload.project.startDate.toJSON()).to.include('2016-05-10T10:00:00.500Z')
  })

  it('user1 adds user2 as a project member', async () => {
    const payload = {
      projectId: project1._id.toString(),
      memberId: user2.userId
    }
    const res = await Project.addMember(payload, user1)
    // console.log('result:', res.payload.project)
    expect(res.topic).to.equal('project:update')
    expect(res.payload.project.members.length).to.equal(1)
    expect(res.payload.project.members[0]).to.equal(user2.userId)
  })

  it('user2 updates the project title as a newly added project member', async () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { title: 'test.test.update2' }
    }
    const res = await Project.update(payload, user2)
    // console.log('result:', res)
    expect(res.topic).to.equal('project:update')
    expect(res.payload.project.title).to.equal(payload.update.title)
  })

  it('user2 fails to delete project since he’s not a project admin', async () => {
    const payload = { projectId: project1._id.toString() }
    try {
      await Project.remove(payload, user2)
      throw new Error('Expected operation to throw!') // Replaces Code.fail
    } catch (reason) {
      expect(reason.output.payload.message).to.include('Cannot delete project')
    }
  })

  it('user1 removes user2 from project', async () => {
    const payload = {
      projectId: project1._id.toString(),
      memberId: user2.userId
    }
    const res = await Project.removeMember(payload, user1)
    // console.log('result:', res.payload.project)
    expect(res.topic).to.equal('project:update')
    expect(res.payload.project.members.length).to.equal(0)
    expect(res.payload.project.admins[0]).to.equal(user1.userId)
  })

  it('user2 fails to update project title since he’s no longer a member', async () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { title: 'test.test.update3' }
    }
    try {
      await Project.update(payload, user2)
      throw new Error('Expected operation to throw!') // Replaces Code.fail
    } catch (reason) {
      // console.log('result:', reason)
      expect(reason.output.payload.message).to.include('Cannot find a valid project')
    }
  })

  it('user1 deletes project', async () => {
    const payload = { projectId: project1._id.toString() }
    const res = await Project.remove(payload, user1)
    expect(res.topic).to.equal('project:remove')
    expect(res.payload.projectId).to.equal(project1._id.toString())
  })

  it('user1 fails to update deleted project', async () => {
    const payload = {
      projectId: project1._id.toString(),
      update: { title: 'test.test.update3' }
    }
    try {
      await Project.update(payload, user1)
      throw new Error('Expected operation to throw!') // Replaces Code.fail
    } catch (reason) {
      // console.log('result:', reason)
      expect(reason.output.payload.message).to.include('Cannot find a valid project')
    }
  })
})
