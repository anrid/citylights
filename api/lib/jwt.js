
const Jwt = require('jsonwebtoken')
const Hoek = require('hoek')
const T = require('tcomb')

const JWT_AUDIENCE = 'taskworld-mobile-app'
const JWT_ISSUER = 'taskworld-mobile-app'

Hoek.assert(
  process.env.CITYLIGHTS_API_SECRET &&
  process.env.CITYLIGHTS_API_SECRET.length > 30,
  'Missing env `CITYLIGHTS_API_SECRET` (> 30 chars)'
)

function createToken (payload) {
  T.Object(payload)
  const opts = {
    expiresIn: '90d',
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER
  }
  return Jwt.sign(payload, process.env.CITYLIGHTS_API_SECRET, opts)
}

function verifyToken (token) {
  T.String(token)
  const opts = {
    algorithms: ['HS256'],
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER
  }
  return Jwt.verify(token, process.env.CITYLIGHTS_API_SECRET, opts)
}

function runTest () {
  const Assert = require('assert')
  const token = createToken({ userId: 666 })
  // Test decoding.
  Assert.strictEqual(verifyToken(token).userId, 666)
  // Test failed decode.
  Assert.throws(() => (
    verifyToken(token.substr(1))
  ), /invalid token/)

  console.log('Tests: OK.')
}

module.exports = {
  createToken,
  verifyToken,
  runTest
}

if (require.main === module) {
  runTest()
}
