
import counter from './counter'
import settings from './settings'
import workspaces from './workspaces'
import users from './users'
import projects from './projects'
import { routerReducer } from 'react-router-redux'

const all = {
  counter,
  settings,
  workspaces,
  users,
  projects,
  routing: routerReducer
}

export default all
