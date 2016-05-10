'use strict'

const initialState = {
  order: ['PROJ1', 'PROJ3', 'PROJ2'],
  data: {
    PROJ1: { _id: 'PROJ1', title: 'Project 1', desc: 'Cool project.', workspaceId: 'SPACE1' },
    PROJ2: { _id: 'PROJ2', title: 'Project 2', desc: 'Daft HAT !!!', workspaceId: 'SPACE1' },
    PROJ3: { _id: 'PROJ3', title: 'Project 3', desc: 'Right on.', workspaceId: 'SPACE1' }
  }
}

export default function projects (state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state
  }
}
