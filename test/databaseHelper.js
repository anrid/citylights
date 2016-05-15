'use strict'

const P = require('bluebird')
const Jwt = require('../api/lib/jwt')

require('../api/lib/database.js')()

const User = require('../api/services/userModel.js')
const Crypt = require('../api/services/cryptService.js')
const Workspace = require('../api/services/workspaceModel.js')

module.exports = {
  _chain: P.resolve(),
  _context: { },

  queue (_promise, name) {
    let promise = P.resolve(_promise)
    if (name) {
      promise = promise.tap((result) => {
        this._context[name] = result
      })
    }

    this._chain = this._chain.then(() => promise)
    return this
  },

  getToken (userId) {
    return Jwt.createToken({ userId })
  },

  wait (func) {
    return this._chain.then(() => func(this._context))
  },

  reset () {
    const removeAllTestData = P.all([
      User.remove({ email: /@test\.test$/ }),
      Workspace.remove({ name: /test\.test/ })
    ])

    return this.queue(removeAllTestData)
  },

  user (name) {
    return this.queue(
      Crypt.createPassword('test123')
      .then((newPassword) => {
        return User.create({
          name,
          email: `${name}@test.test`,
          passwordHash: newPassword.hash,
          passwordSalt: newPassword.salt
        })
      })
    , name)
  }
}
