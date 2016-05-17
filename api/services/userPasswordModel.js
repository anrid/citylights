
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
  hash: { type: String, required: true, min: 32 },
  salt: { type: String, required: true, min: 32 }
})

schema.static('verifyPassword', function (plainTextPassword, user) {
  return P.try(() => {
    T.String(plainTextPassword)
    T.Object(user)

    return this.findOne({ userId: user._id.toString() })
    .then((password) => {
      return Crypt.verifyPassword(plainTextPassword, password.hash, password.salt)
    })
  })
})

schema.static('createPassword', function (plainTextPassword, user) {
  return P.try(() => {
    T.String(plainTextPassword)
    T.Object(user)

    return Crypt.createPassword(plainTextPassword)
    .then((password) => {
      return this.create({
        userId: user._id.toString(),
        hash: password.hash,
        salt: password.salt
      })
    })
  })
})

schema.static('createRandomPassword', function (user) {
  return P.try(() => {
    T.Object(user)

    return Crypt.createRandomPassword()
    .then((password) => {
      return this.create({
        userId: user._id.toString(),
        hash: password.hash,
        salt: password.salt
      })
    })
  })
})

module.exports = Mongoose.model('user_password', schema)
