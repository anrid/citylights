'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { describe, it, before, expect } = exports.lab = Lab.script()

const Db = require('./databaseHelper.js')
const UserEndpoints = require('../api/endpoints/userEndpoints.js')

describe('User Endpoints', () => {
  // Rock on.
  let ctx
  let user1
  let philId
  let workspaceId

  before(async () => {
    await new Promise(resolve => {
      Db.reset()
      .user('user1')
      .workspace('workspace1', 'user1')
      .wait((_ctx) => {
        // console.log('Context:', _ctx)
        ctx = _ctx
        user1 = { userId: ctx.user1._id.toString() }
        workspaceId = ctx.workspace1._id.toString()
        resolve()
      })
    })
  })

  it('user1 invites Phil', async () => {
    const res = await UserEndpoints.invite({
      email: 'punx.phil@test.test',
      firstName: 'Punxsutawnieee',
      lastName: 'Phil',
      workspaceId,
      phoneWork: '555-6969',
      photo: 'https://avatars.com/groundhog.jpg',
      title: 'Prognosticator'
    },
    { userId: user1.userId })
    // console.log('res=', res.payload.user.profile)
    // console.log('res=', res.payload.profile)
    expect(res.topic).to.equal('user:invite:successful')
    expect(res.payload.user.email).to.equal('punx.phil@test.test')
    expect(res.payload.workspace._id.toString()).to.equal(workspaceId)
    expect(res.payload.workspace.membersCount).to.equal(2)

    expect(res.payload.user.profile.title).to.include('Prog')
    expect(res.payload.profile.profile.title).to.include('Prog')
    expect(res.payload.user.profile.photo).to.include('groundhog')
    expect(res.payload.profile.profile.photo).to.include('groundhog')

    // Save for later !
    philId = res.payload.user._id.toString()

    expect(res.payload.profile.userId).to.equal(philId)
    expect(res.payload.profile.workspaceId).to.equal(workspaceId)
  })

  it('user1 sets his own first name to “Admin”', async () => {
    const res = await UserEndpoints.update({
      workspaceId,
      userId: user1.userId,
      update: { firstName: 'Admin' }
    },
    { userId: user1.userId })
    // console.log('res=', res.payload)
    expect(res.topic).to.equal('user:update')
    expect(res.payload.user.firstName).to.equal('Admin')
    expect(res.payload.user.lastName).to.not.exist()
  })

  it('user1 fixes the glaring a typo Phil’s first name !', async () => {
    const res = await UserEndpoints.update({
      workspaceId,
      userId: philId,
      update: { firstName: 'Punxsutawney' }
    },
    { userId: user1.userId })
    // console.log('res=', res.payload)
    expect(res.topic).to.equal('user:update')
    expect(res.payload.user.firstName).to.equal('Punxsutawney')
    expect(res.payload.user.lastName).to.equal('Phil')
  })

  it('user1 updates the title in his work profile', async () => {
    const res = await UserEndpoints.updateWorkProfile({
      workspaceId,
      userId: user1.userId,
      update: { title: 'Yip Sifu' }
    },
    { userId: user1.userId })
    // console.log('res=', res.payload)
    expect(res.topic).to.equal('user:updateWorkProfile')
    expect(res.payload.profile.userId).to.equal(user1.userId)
    expect(res.payload.profile.profile.title).to.equal('Yip Sifu')
  })

  it('user1 updates Phil’s title', async () => {
    const res = await UserEndpoints.updateWorkProfile({
      workspaceId,
      userId: philId,
      update: { title: 'Prognosticator of Prognosticators' }
    },
    { userId: user1.userId })
    // console.log('res=', res.payload)
    expect(res.topic).to.equal('user:updateWorkProfile')
    expect(res.payload.profile.userId).to.equal(philId)
    expect(res.payload.profile.profile.title).to.include('Prognosticators')
  })
})
