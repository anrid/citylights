
import counter from './counter'
import settings from './settings'
import workspaces from './workspaces'
import users from './users'
import projects from './projects'
import shifts from './shifts'

import { routerReducer } from 'react-router-redux'

const all = {
  counter,
  settings,
  workspaces,
  users,
  projects,
  shifts,
  routing: routerReducer
}

export default all
