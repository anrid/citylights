'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import Spinner from '../components/Spinner'

import globalStyles from './globalStyles'

class SwitchWorkspace extends Component {
  componentDidMount () {
    // Load the new workspace !
    const { workspace } = this.props
    const { fetchAppStarter } = this.props.actions
    setTimeout(() => {
      fetchAppStarter(workspace._id)
    }, 500)
  }

  render () {
    const { workspace } = this.props
    return (
      <View style={styles.page}>
        <Text style={[
          globalStyles.whiteText,
          { textAlign: 'center', marginBottom: 10 }
        ]}>
          Switching to Workspace{'\n'}
          {workspace.name}
        </Text>
        <Spinner />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20
  }
})

function mapStateToProps (state) {
  // console.log('Login: state=', state)
  const { settings } = state
  const { workspaceId } = settings.saved
  let workspace = null
  if (!workspaceId) {
    console.error('No workspace id found in `settings.saved`, should never happen !')
  } else {
    workspace = state.workspaces.data[workspaceId]
  }
  return {
    workspace,
    isRequestInProgress: settings.isRequestInProgress,
    error: settings.serverError
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
)(SwitchWorkspace)
