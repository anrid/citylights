'use strict'

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const Db = require('./databaseHelper.js')
const UserEndpoints = require('../api/endpoints/userEndpoints.js')

lab.experiment('User Endpoints', () => {
  // Rock on.
  let ctx
  let user1
  let philId
  let workspaceId

  lab.before((done) => {
    Db.reset()
    .user('user1')
    .workspace('workspace1', 'user1')
    .wait((_ctx) => {
      // console.log('Context:', _ctx)
      ctx = _ctx
      user1 = { userId: ctx.user1._id.toString() }
      workspaceId = ctx.workspace1._id.toString()
      done()
    })
  })

  lab.test('user1 invites Phil', () => {
    return UserEndpoints.invite({
      email: 'punx.phil@test.test',
      firstName: 'Punxsutawnieee',
      lastName: 'Phil',
      workspaceId,
      phoneWork: '555-6969',
      photo: 'https://avatars.com/groundhog.jpg',
      title: 'Prognosticator'
    },
    { userId: user1.userId })
    .then((res) => {
      // console.log('res=', res.payload.user.profile)
      // console.log('res=', res.payload.profile)
      Code.expect(res.topic).to.equal('user:invite:successful')
      Code.expect(res.payload.user.email).to.equal('punx.phil@test.test')
      Code.expect(res.payload.workspace._id.toString()).to.equal(workspaceId)
      Code.expect(res.payload.workspace.membersCount).to.equal(2)

      Code.expect(res.payload.user.profile.title).to.include('Prog')
      Code.expect(res.payload.profile.profile.title).to.include('Prog')
      Code.expect(res.payload.user.profile.photo).to.include('groundhog')
      Code.expect(res.payload.profile.profile.photo).to.include('groundhog')

      // Save for later !
      philId = res.payload.user._id.toString()

      Code.expect(res.payload.profile.userId).to.equal(philId)
      Code.expect(res.payload.profile.workspaceId).to.equal(workspaceId)
    })
  })

  lab.test('user1 sets his own first name to “Admin”', () => {
    return UserEndpoints.update({
      workspaceId,
      userId: user1.userId,
      update: { firstName: 'Admin' }
    },
    { userId: user1.userId })
    .then((res) => {
      // console.log('res=', res.payload)
      Code.expect(res.topic).to.equal('user:update')
      Code.expect(res.payload.user.firstName).to.equal('Admin')
      Code.expect(res.payload.user.lastName).to.not.exist()
    })
  })

  lab.test('user1 fixes the glaring a typo Phil’s first name !', () => {
    return UserEndpoints.update({
      workspaceId,
      userId: philId,
      update: { firstName: 'Punxsutawney' }
    },
    { userId: user1.userId })
    .then((res) => {
      // console.log('res=', res.payload)
      Code.expect(res.topic).to.equal('user:update')
      Code.expect(res.payload.user.firstName).to.equal('Punxsutawney')
      Code.expect(res.payload.user.lastName).to.equal('Phil')
    })
  })

  lab.test('user1 updates the title in his work profile', () => {
    return UserEndpoints.updateWorkProfile({
      workspaceId,
      userId: user1.userId,
      update: { title: 'Yip Sifu' }
    },
    { userId: user1.userId })
    .then((res) => {
      // console.log('res=', res.payload)
      Code.expect(res.topic).to.equal('user:updateWorkProfile')
      Code.expect(res.payload.profile.userId).to.equal(user1.userId)
      Code.expect(res.payload.profile.profile.title).to.equal('Yip Sifu')
    })
  })

  lab.test('user1 updates Phil’s title', () => {
    return UserEndpoints.updateWorkProfile({
      workspaceId,
      userId: philId,
      update: { title: 'Prognosticator of Prognosticators' }
    },
    { userId: user1.userId })
    .then((res) => {
      // console.log('res=', res.payload)
      Code.expect(res.topic).to.equal('user:updateWorkProfile')
      Code.expect(res.payload.profile.userId).to.equal(philId)
      Code.expect(res.payload.profile.profile.title).to.include('Prognosticators')
    })
  })
})
