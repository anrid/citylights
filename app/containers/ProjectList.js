'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import Button from '../components/Button'

import globalStyles from './globalStyles'

class ProjectList extends Component {

  renderProjectItem (projectId, isLast) {
    const { projects, actions } = this.props
    const project = projects.data[projectId]
    return (
      <TouchableOpacity
        key={project._id}
        style={[ styles.projectItem, isLast ? styles.lastItem : { } ]}
        onPress={() => actions.routeTo({ url: `/project/${project._id}` })}
      >
        <View style={styles.row}>
          <Text>{project.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.smallText}>{project.desc}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const { projects, actions, backgrounds } = this.props
    const lastIndex = projects.order.length - 1
    return (
      <Image
        resizeMode='cover'
        source={{ uri: backgrounds.BG7.url }}
        style={globalStyles.backgroundImage}
      >
        <View style={styles.projectList}>
          <View style={[ styles.projectListItems ]}>
            <Text style={[
              globalStyles.headingMedium
            ]}>
              Project List:
            </Text>
            {projects.order.map((id, i) => this.renderProjectItem(id, i === lastIndex))}
          </View>
          <View style={styles.buttonBar}>
            <Button onPress={() => actions.routeBack()}>
              Back
            </Button>
          </View>
        </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  buttonBar: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    margin: 5
  },
  projectList: {
    flex: 1,
    justifyContent: 'space-between'
  },
  projectListItems: {
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5
  },
  projectItem: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    height: 60,
    borderColor: 'lightgray',
    borderTopWidth: 1
  },
  lastItem: {
    borderBottomWidth: 1
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  },
  smallText: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '400'
  }
})

function mapStateToProps (state) {
  // console.log('ProjectList: state=', state)
  return {
    backgrounds: state.settings.backgrounds,
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
)(ProjectList)
