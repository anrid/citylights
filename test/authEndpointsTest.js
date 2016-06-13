'use strict'

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const Db = require('./databaseHelper.js')
const Auth = require('../api/endpoints/authEndpoints.js')

lab.experiment('Auth Endpoints', () => {
  // Rock on.
  let ctx = { }

  lab.before((done) => {
    Db.reset().wait(() => done())
  })

  lab.test('user1 signs up successfully', () => {
    return Auth.signup({
      companyName: 'company.x.test.test',
      email: 'massa@test.test',
      firstName: 'Massa',
      lastName: 'Mun',
      password: 'test123'
    })
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('auth:successful')
      Code.expect(res.payload.identity.userId).to.exist()
      Code.expect(res.payload.identity.accessToken).to.exist()
      Code.expect(res.payload.info.workspaceId).to.exist()
      Code.expect(res.payload.info.email).to.exist()
      ctx.user1 = res.payload
    })
  })

  lab.test('user1 can fetch a valid starter', () => {
    return Auth.appStarter(
      { workspaceId: ctx.user1.info.workspaceId },
      { userId: ctx.user1.identity.userId }
    )
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('app:starter')
      Code.expect(res.payload.user._id.toString()).to.equal(ctx.user1.identity.userId)
      Code.expect(res.payload.userList[0]._id.toString()).to.equal(ctx.user1.identity.userId)
      Code.expect(res.payload.workspace.name).to.equal('company.x.test.test')
      Code.expect(res.payload.workspaceList[0].name).to.equal('company.x.test.test')
      Code.expect(res.payload.workspaceList[0].membersCount).to.equal(1)
    })
  })

  lab.test('user1 can login successfully', () => {
    return Auth.login({ email: 'massa@test.test', password: 'test123' })
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('auth:successful')
      Code.expect(res.payload.identity.userId).to.equal(ctx.user1.identity.userId)
      Code.expect(res.payload.identity.accessToken).to.equal(ctx.user1.identity.accessToken)
    })
  })

  lab.test('user1 has an access token that passes all checks', () => {
    return Auth.checkAccessToken({
      accessToken: ctx.user1.identity.accessToken,
      workspaceId: ctx.user1.info.workspaceId
    })
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('auth:token:successful')
      Code.expect(res.payload.identity.userId).to.equal(ctx.user1.identity.userId)
      Code.expect(res.payload.identity.accessToken).to.not.exist()
      Code.expect(res.payload.info.email).to.equal(ctx.user1.info.email)
      Code.expect(res.payload.info.workspaceId).to.not.exist()
    })
  })

  lab.test('ensures our sanity', (done) => {
    Code.expect(1 + 1).to.equal(2)
    done()
  })
})
