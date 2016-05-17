'use strict'

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const Db = require('./databaseHelper.js')
const Ws = require('../api/endpoints/workspaceEndpoints.js')

lab.experiment('Workspace Endpoints', () => {
  // Rock on.
  let ctx
  let user1
  let workspace1

  lab.before((done) => {
    Db.reset()
    .user('user1')
    .wait((_ctx) => {
      // console.log('Context:', _ctx)
      ctx = _ctx
      user1 = { userId: ctx.user1._id.toString() }
      done()
    })
  })

  lab.test('user1 creates a new workspace', (done) => {
    Ws.create({ name: 'test.test' }, { userId: user1.userId })
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('workspace:create')
      Code.expect(res.payload.workspace.ownerId).to.equal(user1.userId)
      Code.expect(res.payload.workspace.url.length > 4).to.be.true()
      Code.expect(res.payload.workspace.membersCount).to.equal(1)
      workspace1 = res.payload.workspace
      done()
    })
  })

  lab.test('user1 updates the workspace name', (done) => {
    const payload = {
      workspaceId: workspace1._id.toString(),
      update: { name: 'test.test.update' }
    }
    Ws.update(payload, { userId: user1.userId })
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('workspace:update')
      Code.expect(res.payload.workspace.name).to.equal(payload.update.name)
      done()
    })
  })
})
