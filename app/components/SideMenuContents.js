'use strict'

import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import globalStyles from '../containers/globalStyles'

const window = Dimensions.get('window')
const uri = 'http://pickaface.net/includes/themes/clean/img/slide2.png'

class SideMenuContents extends Component {

  renderMenuItems (opts) {
    return (
      <View>
        <Text style={globalStyles.headingMedium}>
          {opts.title}
        </Text>

        <View>
          {opts.items.map((x, i) => (
            <Text key={i}
              onPress={() => this.props.onItemSelected(x.data)}
              style={globalStyles.whiteText}>
              {x.title}
            </Text>
          ))}
        </View>
      </View>
    )
  }

  render () {
    const {
      overviewMenu,
      projectListMenu,
      projectMenu
    } = this.props

    const workspaceItems = {
      title: 'Workspaces',
      items: [
        { title: 'Taskworld (52 members)', data: { workspaceId: 1 } },
        { title: 'Google (10,000+ members)', data: { workspaceId: 2 } }
      ]
    }

    const projectItems = {
      title: 'Projects',
      items: [
        { title: 'Project 1 (12 tasks, 2 overdue)', data: { projectId: 1 } },
        { title: 'Project 2 (166 tasks, 10 overdue)', data: { projectId: 2 } }
      ]
    }

    const tasksInProjectItems = {
      title: 'Tasks in Project',
      items: [
        { title: 'Task 1 (Assigned to Me)', data: { taskId: 1 } },
        { title: 'Task 2 (Assigned to Jane)', data: { taskId: 2 } }
      ]
    }

    return (
      <ScrollView scrollsToTop={false} style={styles.menu}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri }}/>
          <Text style={styles.name}>Your name</Text>
        </View>

        {overviewMenu && this.renderMenuItems(workspaceItems)}

        {projectListMenu && this.renderMenuItems(projectItems)}

        {projectMenu && this.renderMenuItems(tasksInProjectItems)}

      </ScrollView>
    )
  }
}

SideMenuContents.propTypes = {
  onItemSelected: React.PropTypes.func.isRequired,
  overviewMenu: React.PropTypes.bool,
  projectListMenu: React.PropTypes.bool,
  projectMenu: React.PropTypes.bool
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: 'rgba(77, 57, 75, 1)',
    padding: 20
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1
  },
  name: {
    position: 'absolute',
    left: 70,
    top: 20
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5
  }
})

function mapStateToProps (state) {
  return {
    projects: state.projects
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideMenuContents)
