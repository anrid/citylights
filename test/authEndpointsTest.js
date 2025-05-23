'use strict'

const Code = require('@hapi/code')
const Lab = require('@hapi/lab')
const { describe, it, before, expect } = exports.lab = Lab.script()

const Db = require('./databaseHelper.js')
const Auth = require('../api/endpoints/authEndpoints.js')

describe('Auth Endpoints', () => {
  // Rock on.
  let ctx = { }

  before(async () => {
    // Assuming Db.reset() can be made to return a promise or is awaitable.
    // If Db.reset().wait() is a custom synchronous blocking call, this needs more investigation.
    // For now, we'll try to make it promise-based if possible, or wrap it.
    // If Db.reset() itself is async and returns a promise:
    // await Db.reset();
    // If Db.reset().wait() is synchronous and we need to promisify:
    await new Promise(resolve => Db.reset().wait(resolve));
  })

  it('user1 signs up successfully', async () => {
    const res = await Auth.signup({
      companyName: 'company.x.test.test',
      email: 'massa@test.test',
      firstName: 'Massa',
      lastName: 'Mun',
      password: 'test123'
    })
    // console.log('result:', res)
    expect(res.topic).to.equal('auth:successful')
    expect(res.payload.identity.userId).to.exist()
    expect(res.payload.identity.accessToken).to.exist()
    expect(res.payload.info.workspaceId).to.exist()
    expect(res.payload.info.email).to.exist()
    ctx.user1 = res.payload
  })

  it('user1 can fetch a valid starter', async () => {
    const res = await Auth.appStarter(
      { workspaceId: ctx.user1.info.workspaceId },
      { userId: ctx.user1.identity.userId }
    )
    // console.log('result:', res)
    expect(res.topic).to.equal('app:starter')
    expect(res.payload.user._id.toString()).to.equal(ctx.user1.identity.userId)
    expect(res.payload.userList[0]._id.toString()).to.equal(ctx.user1.identity.userId)
    expect(res.payload.workspace.name).to.equal('company.x.test.test')
    expect(res.payload.workspaceList[0].name).to.equal('company.x.test.test')
    expect(res.payload.workspaceList[0].membersCount).to.equal(1)
  })

  it('user1 can login successfully', async () => {
    const res = await Auth.login({ email: 'massa@test.test', password: 'test123' })
    // console.log('result:', res)
    expect(res.topic).to.equal('auth:successful')
    expect(res.payload.identity.userId).to.equal(ctx.user1.identity.userId)
    expect(res.payload.identity.accessToken).to.equal(ctx.user1.identity.accessToken)
  })

  it('user1 has an access token that passes all checks', async () => {
    const res = await Auth.checkAccessToken({
      accessToken: ctx.user1.identity.accessToken,
      workspaceId: ctx.user1.info.workspaceId
    })
    // console.log('result:', res)
    expect(res.topic).to.equal('auth:token:successful')
    expect(res.payload.identity.userId).to.equal(ctx.user1.identity.userId)
    expect(res.payload.identity.accessToken).to.not.exist()
    expect(res.payload.info.email).to.equal(ctx.user1.info.email)
    expect(res.payload.info.workspaceId).to.not.exist()
  })

  it('ensures our sanity', () => {
    expect(1 + 1).to.equal(2)
    // done callback is not needed for synchronous tests or tests returning a promise with @hapi/lab
  })
})
