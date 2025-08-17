import T from 'tcomb'
import UserService from './userService.js'
import WorkspaceService from './workspaceService.js'
import MemberService from './memberService.js'
import ProjectService from './projectService.js'
import ShiftService from './shiftService.js'

async function getStarter(workspaceId, userId) {
  T.String(workspaceId)
  T.String(userId)
  
  // Simple approach: fetch the workspace and user directly using Mongoose models
  try {
    const User = (await import('./userModel.js')).default
    const Workspace = (await import('./workspaceModel.js')).default
    
    const user = await User.findOne({ _id: userId })
    const workspace = await Workspace.findOne({ _id: workspaceId })
    const workspaceList = await Workspace.find({ ownerId: userId })
    
    return {
      user,
      userList: [user], // Just include the current user for now
      workspace,
      workspaceList,
      projectList: [],
      shiftList: []
    }
  } catch (error) {
    console.error('StarterService.getStarter error:', error)
    return {
      user: null,
      userList: [],
      workspace: null,
      workspaceList: [],
      projectList: [],
      shiftList: []
    }
  }
}

export default {
  getStarter
}