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
      email: 'friend1@test.test',
      firstName: 'Friendly',
      lastName: 'Buddy',
      workspaceId
    },
    { userId: user1.userId })
    .then((res) => {
      // console.log('res=', res)
      Code.expect(res.topic).to.equal('user:invite:successful')
      Code.expect(res.payload.user.email).to.equal('friend1@test.test')
      Code.expect(res.payload.workspace._id.toString()).to.equal(workspaceId)
      Code.expect(res.payload.workspace.membersCount).to.equal(2)
    })
  })
})
