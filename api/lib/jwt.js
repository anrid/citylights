
import Jwt from 'jsonwebtoken'
import T from 'tcomb'

const JWT_AUDIENCE = 'taskworld-mobile-app'
const JWT_ISSUER = 'taskworld-mobile-app'

// For development, use a default secret if not provided
const JWT_SECRET = process.env.CITYLIGHTS_API_SECRET || 'development-secret-key-minimum-30-chars-long'

function createToken (payload) {
  T.Object(payload)
  const opts = {
    expiresIn: '90d',
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER
  }
  return Jwt.sign(payload, JWT_SECRET, opts)
}

function verifyToken (token) {
  T.String(token)
  const opts = {
    algorithms: ['HS256'],
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER
  }
  return Jwt.verify(token, JWT_SECRET, opts)
}

function runTest () {
  const token = createToken({ userId: 666 })
  // Test decoding.
  const decoded = verifyToken(token)
  if (decoded.userId !== 666) {
    throw new Error('JWT test failed')
  }
  console.log('JWT Tests: OK.')
}

export default {
  createToken,
  verifyToken,
  runTest
}
