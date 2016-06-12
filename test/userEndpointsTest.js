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

  lab.test('user1 invites friend1', () => {
    return UserEndpoints.invite({
      email: 'punx.phil@test.test',
      firstName: 'Punxsutawney',
      lastName: 'Phil',
      workspaceId,
      phoneWork: '555-6969',
      photo: 'https://avatars.com/groundhog.jpg',
      title: 'Prognosticator of Prognosticators'
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

      Code.expect(res.payload.profile.userId).to.equal(res.payload.user._id.toString())
      Code.expect(res.payload.profile.workspaceId).to.equal(workspaceId)
    })
  })
})
