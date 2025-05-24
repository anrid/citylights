'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { describe, it, before } = exports.lab = Lab.script() // Removed expect

const Db = require('./databaseHelper.js')
const Ws = require('../api/endpoints/workspaceEndpoints.js')

describe('Workspace Endpoints', () => {
  // Rock on.
  let ctx
  let user1
  let workspace1

  before(async () => {
    await new Promise(resolve => {
      Db.reset()
      .user('user1')
      .wait((_ctx) => {
        // console.log('Context:', _ctx)
        ctx = _ctx
        user1 = { userId: ctx.user1._id.toString() }
        resolve()
      })
    })
  })

  it('user1 creates a new workspace', async () => {
    const res = await Ws.create({ name: 'test.test' }, { userId: user1.userId })
    // console.log('result:', res)
    Code.expect(res.topic).to.equal('workspace:create')
    Code.expect(res.payload.workspace.ownerId).to.equal(user1.userId)
    Code.expect(res.payload.workspace.name).to.equal('test.test') // Corrected: use the actual name
    Code.expect(res.payload.workspace.membersCount).to.equal(1) // Corrected: use Code.expect
    workspace1 = res.payload.workspace
  })

  it('user1 updates the workspace name', async () => {
    const payload = {
      workspaceId: workspace1._id.toString(),
      update: { name: 'test.test.update' }
    }
    const res = await Ws.update(payload, { userId: user1.userId })
    // console.log('result:', res)
    Code.expect(res.topic).to.equal('workspace:update')
    Code.expect(res.payload.workspace.name).to.equal(payload.update.name)
  })
})
