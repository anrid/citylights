'use strict'

import React, { Component } from 'react'

import TopNav from './TopNav'
import ControlBar from './ControlBar'
// import TimeBar from './TimeBar'
// import ProjectRow from './ProjectRow'

export default class TimePlannerApp extends Component {
  render () {
    const projects = [
      { _id: 'PROJ1', title: 'Time Off', members: [], color: 0, noMembers: true },
      { _id: 'PROJ2', title: 'My Awesome Project', members: [], color: 1 },
      { _id: 'PROJ3', title: 'Blazing Webapp !', members: [], color: 2 },
      { _id: 'PROJ4', title: 'Support Team', members: [], color: 3 },
      { _id: 'PROJ5', title: 'New Marketing Website — Phase 1', members: [], color: 5 },
      { _id: 'PROJ6', title: 'New Marketing Website — Phase 2', members: [], color: 5 }
    ]

    const pivotDate = '2016-06-01'
    // <TimeBar pivotDate={pivotDate} />
    // {projects.map((x) => <ProjectRow key={x._id} project={x} pivotDate={pivotDate} />)}

    return (
      <section id='pl-time-planner-app'>
        <TopNav />
        <ControlBar />
      </section>
    )
  }
}
