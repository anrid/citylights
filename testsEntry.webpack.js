'use strict'

const context = require.context('./app/', true, /-test\.js$/)
context.keys().forEach(context)
