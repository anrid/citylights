import mongoose from 'mongoose'
import Jwt from '../lib/jwt.js'
import '../lib/database.js'

// Import models
import User from '../services/userModel.js'
import UserService from '../services/userService.js'
import Workspace from '../services/workspaceModel.js'
import WorkspaceService from '../services/workspaceService.js'
import UserPassword from '../services/userPasswordModel.js'
import WorkspaceMember from '../services/workspaceMemberModel.js'
import WorkspaceProfile from '../services/workspaceProfileModel.js'
import Project from '../services/projectModel.js'
import ProjectService from '../services/projectService.js'
import MemberService from '../services/memberService.js'
import Shift from '../services/shiftModel.js'

export async function resetDatabase() {
  await Promise.all([
    User.deleteMany({}),
    Workspace.deleteMany({}),
    WorkspaceMember.deleteMany({}),
    WorkspaceProfile.deleteMany({}),
    UserPassword.deleteMany({}),
    Project.deleteMany({}),
    Shift.deleteMany({})
  ])
}

export function getToken(userId) {
  return Jwt.createToken({ userId })
}

export function getId() {
  return new mongoose.Types.ObjectId().toString()
}

export async function createUser(name) {
  const email = `${name}@test.test`
  return await UserService.signup({
    email,
    firstName: name,
    password: 'test123'
  })
}

export async function createWorkspace(name, ownerId) {
  return await WorkspaceService.create(`${name}.test.test`, ownerId)
}

export async function createProject(name, workspaceId, ownerId) {
  return await ProjectService.create({
    _id: getId(),
    title: `${name}.test.test`,
    workspaceId
  }, ownerId)
}

export async function addUserToWorkspace(userId, workspaceId) {
  return await MemberService.addUserToWorkspace(
    userId,
    workspaceId,
    { profile: { isTestUser: true } }
  )
}

export async function addMemberToProject(userId, projectId, actorId) {
  return await ProjectService.addMember(userId, projectId, actorId)
}