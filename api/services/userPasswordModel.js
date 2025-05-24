
const P = require('bluebird')
const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
const T = require('tcomb')

const Crypt = require('./cryptService')

const schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  // With Argon2, the salt is embedded in the hash string.
  // The 'hash' field will store the complete Argon2 hash output.
  hash: { type: String, required: true } // min: 32 might be too short for Argon2 default output, remove or adjust
})

schema.static('verifyPassword', function (plainTextPassword, user) {
  return P.try(() => {
    T.String(plainTextPassword)
    T.Object(user)

    return this.findOne({ userId: user._id.toString() })
    .then((passwordDoc) => { // Renamed 'password' to 'passwordDoc' to avoid confusion
      if (!passwordDoc) {
        throw new Error('Password document not found for user.'); // Or handle as unauthorized
      }
      // Crypt.verifyPassword now only needs the plain text password and the stored hash (which includes the salt)
      return Crypt.verifyPassword(plainTextPassword, passwordDoc.hash)
    })
  })
})

schema.static('createPassword', function (plainTextPassword, user) {
  return P.try(() => {
    T.String(plainTextPassword)
    T.Object(user)

    // Crypt.createPassword returns the argon2 hash string directly.
    return Crypt.createPassword(plainTextPassword)
    .then((hashString) => { // Renamed to hashString for clarity
      return this.create({
        userId: user._id.toString(),
        hash: hashString // The hashString is the direct result from Crypt.createPassword
        // No separate salt field to save
      })
    })
  })
})

schema.static('createRandomPassword', function (user) {
  return P.try(() => {
    T.Object(user)

    // Crypt.createRandomPassword returns an object like { hash: 'argon2_string', salt: null }
    return Crypt.createRandomPassword()
    .then((cryptoResult) => { // Renamed 'password' to 'cryptoResult'
      return this.create({
        userId: user._id.toString(),
        hash: cryptoResult.hash // The hash from Argon2 already contains the salt
        // No separate salt field to save
      })
    })
  })
})

module.exports = Mongoose.model('user_password', schema)
