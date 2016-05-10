'use strict'

import React, { Component } from 'react'
import {
  Navigator,
  View,
  Text
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'

import Overview from './Overview'
import Login from './Login'
import Signup from './Signup'
import ProjectList from './ProjectList'
import Project from './Project'
import CreateWorkspaceForm from './CreateWorkspaceForm'
import SwitchWorkspace from './SwitchWorkspace'
import SideMenuWrapper from '../components/SideMenuWrapper'
import Spinner from '../components/Spinner'

import globalStyles from './globalStyles'

class Root extends Component {
  // Initialize our app: Loaded saved app state and
  // connect to the backend.
  componentDidMount () {
    console.log('App root mounted.')

    const { navigator } = this.props
    const { actions } = navigator.props
    actions.setNavigator(navigator)

    // Let’s do this.
    setTimeout(() => {
      actions.initApp()
    }, 500)
  }

  render () {
    return (
      <View style={globalStyles.backgroundCentered}>
        <Text style={{ color: 'white', marginBottom: 10 }}>Loading ..</Text>
        <Spinner />
      </View>
    )
  }
}

class Pages extends Component {
  renderScene (route, navigator) {
    // console.log('Pages route:', route)
    switch (route.name) {
      case 'Root':
        return (
          <Root navigator={navigator} />
        )

      case 'Login':
        return (
          <Login />
        )

      case 'Signup':
        return (
          <Signup />
        )

      case 'CreateWorkspace':
        return (
          <CreateWorkspaceForm />
        )

      case 'SwitchWorkspace':
        return (
          <SwitchWorkspace />
        )

      case 'Overview':
        return (
          <SideMenuWrapper overviewMenu>
            <Overview />
          </SideMenuWrapper>
        )

      case 'Projects':
        return (
          <SideMenuWrapper projectListMenu>
            <ProjectList />
          </SideMenuWrapper>
        )

      case 'Project':
        return (
          <SideMenuWrapper projectMenu>
            <Project projectId={route.projectId} />
          </SideMenuWrapper>
        )

      default:
        console.log('Unknown route:', route.name)
    }
  }

  render () {
    return (
      <Navigator
        {...this.props}
        initialRoute={{ name: 'Root' }}
        renderScene={this.renderScene}
      />
    )
  }
}

function mapStateToProps (state) {
  // console.log('Pages: state=', state)
  return {
    currentRoute: state.settings.route
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
)(Pages)
