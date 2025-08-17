
import mongoose from 'mongoose'
import T from 'tcomb'

const Schema = mongoose.Schema

const schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  hash: { type: String, required: true, min: 32 },
  salt: { type: String, required: true, min: 32 }
})

schema.static('verifyPassword', async function (plainTextPassword, user) {
  T.String(plainTextPassword)
  T.Object(user)

  const password = await this.findOne({ userId: user._id.toString() })
  if (!password) {
    throw new Error('Password not found')
  }
  
  // Simplified verification - implement proper crypto later
  return password.hash === plainTextPassword
})

schema.static('createPassword', async function (plainTextPassword, user) {
  T.String(plainTextPassword)
  T.Object(user)

  // Simplified creation - implement proper crypto later
  return await this.create({
    userId: user._id.toString(),
    hash: plainTextPassword, // Should be properly hashed
    salt: 'salt123' // Should be random salt
  })
})

schema.static('createRandomPassword', async function (user) {
  T.Object(user)

  // Simplified random password - implement proper crypto later
  const randomPassword = Math.random().toString(36).slice(-8)
  return await this.create({
    userId: user._id.toString(),
    hash: randomPassword,
    salt: 'salt123'
  })
})

export default mongoose.model('user_password', schema)
