'use strict'
console.log('[DB_HELPER_LOG] Starting test/databaseHelper.js');

const P = require('bluebird')
const Jwt = require('../api/lib/jwt')
const Hoek = require('@hapi/hoek')

console.log('[DB_HELPER_LOG] About to require and execute database.js');
let connectionPromise;
try {
  // Store the promise returned by the connect function
  connectionPromise = require('../api/lib/database.js')();
  console.log('[DB_HELPER_LOG] Finished requiring and executing database.js (connection initiated).');
} catch (e) {
  console.error('[DB_HELPER_LOG] Error during require/execution of database.js:', e.message, e.stack);
  // If connection initiation fails critically, we should probably not proceed.
  connectionPromise = P.reject(e); // Ensure connectionPromise is a rejected promise
  throw e; 
}

const Mongoose = require('mongoose')
const User = require('../api/services/userModel')
const UserService = require('../api/services/userService')

const Workspace = require('../api/services/workspaceModel')
const WorkspaceService = require('../api/services/workspaceService')

const UserPassword = require('../api/services/userPasswordModel')
const WorkspaceMember = require('../api/services/workspaceMemberModel')
const WorkspaceProfile = require('../api/services/workspaceProfileModel')

const Project = require('../api/services/projectModel')
const ProjectService = require('../api/services/projectService')
const MemberService = require('../api/services/memberService')

const Shift = require('../api/services/shiftModel')

module.exports = {
  // Start the promise chain only after the connection promise resolves
  _chain: P.resolve(connectionPromise).then(() => {
    console.log('[DB_HELPER_LOG] Database connection promise resolved, starting test operations chain.');
  }).catch(err => {
    console.error('[DB_HELPER_LOG] Database connection failed before starting test chain:', err.message);
    // Propagate the error to fail tests quickly if DB connection is an issue
    throw err;
  }),
  _context: { },

  // Enqueue expect a function as it’s first argument.
  // All queued functions will be executed in sequence (waterfall) and their
  // results added to our context.
  queue (func, name) {
    const funcName = name || func.name || 'anonymous_queue_func';
    console.log(`[DB_HELPER_LOG] Queuing function: ${funcName}`);
    this._chain = this._chain
    .then(() => {
      console.log(`[DB_HELPER_LOG] Executing queued function: ${funcName}`);
      return P.resolve(func());
    })
    .tap((result) => {
      if (name) { 
        console.log(`[DB_HELPER_LOG] Added ${name} to context after running ${funcName}`);
        this._context[name] = result;
      } else {
        console.log(`[DB_HELPER_LOG] Finished executing ${funcName} (no context name)`);
      }
    })
    .catch(err => {
      console.error(`[DB_HELPER_LOG] Error in queued function ${funcName}:`, err.message, err.stack);
      throw err; 
    });
    return this
  },

  getToken (userId) {
    return Jwt.createToken({ userId })
  },

  getId () {
    return new Mongoose.Types.ObjectId().toString()
  },

  wait (func) {
    console.log('[DB_HELPER_LOG] Entering wait function');
    return this._chain
      .then(() => {
        console.log('[DB_HELPER_LOG] Executing wait callback after promise chain completion.');
        return func(this._context);
      })
      .catch(err => {
        console.error('[DB_HELPER_LOG] Error in promise chain before or during wait callback:', err.message, err.stack);
        throw err;
      });
  },

  reset () {
    console.log('[DB_HELPER_LOG] Db.reset() called');
    const removeAllTestData = P.all([
      User.deleteMany({}).exec(),
      Workspace.deleteMany({}).exec(),
      WorkspaceMember.deleteMany({}).exec(),
      WorkspaceProfile.deleteMany({}).exec(),
      UserPassword.deleteMany({}).exec(),
      Project.deleteMany({}).exec(),
      Shift.deleteMany({}).exec()
    ]);
    return this.queue(() => removeAllTestData, 'dbReset');
  },

  user (name) {
    return this.queue(() => {
      const email = `${name}@test.test`
      return UserService.signup({
        email,
        firstName: name,
        password: 'test123'
      })
    }, name)
  },

  workspace (name, ownerName) {
    return this.queue(() => {
      const owner = this._context[ownerName]
      Hoek.assert(owner, `Missing user in context: ${ownerName}`)
      return WorkspaceService.create(`${name}.test.test`, owner._id.toString())
    }, name)
  },

  project (name, workspaceName, ownerName) {
    return this.queue(() => {
      const owner = this._context[ownerName]
      const workspace = this._context[workspaceName]
      Hoek.assert(owner, `Missing user in context: ${ownerName}`)
      Hoek.assert(workspace, `Missing workspace in context: ${workspaceName}`)
      return ProjectService.create({
        _id: module.exports.getId(),
        title: `${name}.test.test`,
        workspaceId: workspace._id.toString()
      }, owner._id.toString())
    }, name)
  },

  addToWorkspace (userName, workspaceName) {
    return this.queue(() => {
      const user = this._context[userName]
      const workspace = this._context[workspaceName]
      Hoek.assert(user, `Missing user in context: ${userName}`)
      Hoek.assert(workspace, `Missing workspace in context: ${workspaceName}`)
      return MemberService.addUserToWorkspace(
        user._id.toString(),
        workspace._id.toString(),
        { profile: { isTestUser: true } }
      )
    })
  },

  addMemberToProject (userName, projectName, actorName) {
    return this.queue(() => {
      const user = this._context[userName]
      const project = this._context[projectName]
      const actor = this._context[actorName]
      Hoek.assert(user, `Missing user in context: ${userName}`)
      Hoek.assert(project, `Missing project in context: ${projectName}`)
      Hoek.assert(actor, `Missing actor in context: ${actorName}`)
      return ProjectService.addMember(
        user._id.toString(),
        project._id.toString(),
        actor._id.toString()
      )
    })
  }

}
