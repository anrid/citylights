'use strict'

const P = require('bluebird')
const Scrypt = require('scrypt')
P.promisifyAll(Scrypt)

const Crypto = require('crypto')
const Boom = require('boom')

function createNewId () {
  return createPassword(String(Date.now()))
  .then((result) => result.hash.substr(0, 24))
}

function createRandomPassword () {
  const randomPassword = Crypto.randomBytes(32).toString('hex')
  return createPassword(randomPassword)
}

function createPassword (password) {
  const salt = Crypto.randomBytes(64).toString('hex')
  return _encrypt(password, salt)
  .then((result) => {
    return {
      hash: result.toString('hex'),
      salt
    }
  })
}

function verifyPassword (password, hash, salt) {
  return _encrypt(password, salt)
  .then((result) => {
    if (hash !== result.toString('hex')) {
      throw Boom.unauthorized()
    }
    return true
  })
}

function _encrypt (password, salt) {
  return Scrypt.hashAsync(password, { N: 64, r: 8, p: 16 }, 64, salt)
}

module.exports = {
  createRandomPassword,
  createPassword,
  createNewId,
  verifyPassword
}
