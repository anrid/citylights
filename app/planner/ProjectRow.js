'use strict'

import React, { Component } from 'react'
import Radium from 'radium'
import Moment from 'moment'

import colors from '../styles/colors'

import GridOverlay from './GridOverlay'

class ProjectRow extends Component {
  static propTypes = {
    project: React.PropTypes.object.isRequired,
    pivotDate: React.PropTypes.any.isRequired
  };

  render () {
    const { project } = this.props
    const startDate = Moment(this.props.pivotDate).startOf('isoWeek')
    const colors = ['gray', 'amber', 'green', 'red', 'teal', 'blue', 'purple', 'brown']
    const color = colors[project.color]

    let membersInfo = null
    if (!project.noMembers && project.members.length) {
      membersInfo = `${project.members.length} members.`
    }

    return (
      <section style={styles.base}>
        <div style={styles.left}>
          <div style={styles.info}>
            <div style={[styles.label, styles[color]]} />
            <div style={styles.title}>
              {project.title}
            </div>
            <div style={styles.stats}>
              {membersInfo}
            </div>
          </div>
          <i style={styles.angle} className='fa fa-angle-down' />
        </div>
        <div style={styles.right}>
          <GridOverlay size={90} />
        </div>
      </section>
    )
  }
}

const styles = {
  base: {
    display: 'flex',
    background: 'white',
    color: $c-gray400,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid '$c-gray200
  },
  angle: {
    flex: 1,
    textAlign: 'right',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: $c-gray300,
    cursor: 'pointer'
  },
  left: {
    flex: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '50px',
    borderRight: '1px solid '$c-gray200,
    width: '324px',
    padding: '0 12px 0 17px',
    position: 'relative',
    ':hover': {
      backgroundColor: $c-gray100
    }
  },
  label: {
    position: 'absolute',
    width: '5px',
    height: '100%',
    backgroundColor: $c-gray700,
    top: 0,
    left: 0
  },
  amber: { backgroundColor: $c-amber400 },
  green: { backgroundColor: $c-green400 },
  red: { backgroundColor: $c-red400 },
  teal: { backgroundColor: $c-teal400 },
  blue: { backgroundColor: $c-blue500 },
  purple: { backgroundColor: $c-purple500 },
  brown: { backgroundColor: $c-brown500 },
  right: {
    flex: '10 10',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '50px',
    minWidth: '300px',
    overflow: 'hidden'
  },
  info: {
    height: '40px',
    width: '250px'
    // border: '1px solid red'
  },
  title: {
    fontSize: '1.3rem',
    lineHeight: 1.6,
    fontWeight: 600,
    color: $c-gray800
  },
  stats: {
    fontSize: '1rem',
    lineHeight: 1.2,
    fontWeight: 400,
    color: $c-gray500
  }
}

export default Radium(ProjectRow)
