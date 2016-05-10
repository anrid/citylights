'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import Button from '../components/Button'

import globalStyles from './globalStyles'

export default class Project extends Component {
  render () {
    const { project, actions, backgrounds } = this.props
    return (
      <Image
        resizeMode='cover'
        source={{ uri: backgrounds.BG6.url }}
        style={globalStyles.backgroundImage}
      >
        <View style={[ styles.project ]}>
          <View>
            <Text style={globalStyles.headingMedium}>
              Project: {project.title}
            </Text>
          </View>

          <View style={styles.overlay}>
            <Text style={globalStyles.whiteText}>Description:</Text>
            <Text style={globalStyles.whiteText}>
              {project.desc}
            </Text>
          </View>

          <View>
            <Button onPress={() => actions.routeTo({ url: '/overview' })}>
              Overview
            </Button>
            <Button onPress={() => actions.routeBack()} isSiblingBottom>
              Back
            </Button>
          </View>
        </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  project: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 20,
    marginHorizontal: 5
  },
  overlay: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'stretch',
    marginHorizontal: -5,
    marginBottom: 10,
    alignItems: 'flex-start'
  }
})

function mapStateToProps (state, props) {
  // console.log('Project: state=', state, 'props=', props)
  return {
    backgrounds: state.settings.backgrounds,
    project: state.projects.data[props.projectId]
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
)(Project)
