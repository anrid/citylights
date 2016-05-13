'use strict'

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const Db = require('./databaseHelper.js')
const Auth = require('../api/endpoints/authEndpoints.js')

lab.experiment('math', () => {
  // Rock on.
  let ctx

  lab.before((done) => {
    Db.reset()
    .user('user1')
    .user('user2')
    .wait((_ctx) => {
      // console.log('Context:', _ctx)
      ctx = _ctx
      done()
    })
  })

  lab.test('user1 logs in successfully', (done) => {
    Auth.login({ email: ctx.user1.email, password: 'test123' })
    .then((res) => {
      // console.log('result:', res)
      Code.expect(res.topic).to.equal('auth:successful')
      Code.expect(res.payload.userId).to.equal(ctx.user1._id.toString())
      Code.expect(res.payload.accessToken).to.exist()
      done()
    })
  })

  lab.test('returns true when 1 + 1 equals 2', (done) => {
    Code.expect(1 + 1).to.equal(2)
    done()
  })
})
