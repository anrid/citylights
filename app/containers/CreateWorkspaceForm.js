'use strict'

import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image
} from 'react-native'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as settingsActions from '../actions/settingsActions'
import * as workspaceActions from '../actions/workspaceActions'

import Button from '../components/Button'
import PopupBox from '../components/PopupBox'
import Spinner from '../components/Spinner'

import globalStyles from './globalStyles'

class CreateWorkspaceForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
  }

  renderError () {
    const { error } = this.props
    const code = error && error.code
    if (!code) {
      return null
    }

    let errorMessage
    switch (code) {
      case 400:
        errorMessage = error.error.message
        break
      default:
        errorMessage = 'Internal server error'
    }
    return (
      <PopupBox>{errorMessage}</PopupBox>
    )
  }

  renderSubmitButton () {
    const { isRequestInProgress } = this.props
    const { createWorkspace } = this.props.actions
    if (isRequestInProgress) {
      return <Spinner/>
    }
    return (
      <Button onPress={() => createWorkspace(this.state.name)}>
        Create
      </Button>
    )
  }

  render () {
    const { backgrounds, isRequestInProgress } = this.props
    const { routeBack } = this.props.actions
    return (
      <Image
        resizeMode='cover'
        source={{ uri: backgrounds.BG2.url }}
        style={globalStyles.backgroundImage}
      >
        <View style={styles.form}>

          {this.renderError()}

          <View style={styles.box}>
            <Text style={globalStyles.headingMedium}>
              Create a new Workspace.{'\n'}
            </Text>

            <View style={globalStyles.textInputBox}>
              <TextInput
                autoCorrect={false}
                autoCapitalize='words'
                editable={!isRequestInProgress}
                placeholder='Workspace Name'
                style={globalStyles.textInput}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                autoFocus={!isRequestInProgress}
              />
            </View>

            <View style={globalStyles.buttonBar}>
              {this.renderSubmitButton()}
            </View>

            <Text style={globalStyles.whileTextLink} onPress={routeBack}>
              Cancel
            </Text>
          </View>

        </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.5)',
    padding: 20,
    margin: 0
  }
})

function mapStateToProps (state) {
  // console.log('CreateWorkspaceForm: state=', state)
  const { settings } = state
  return {
    isRequestInProgress: settings.isRequestInProgress,
    backgrounds: settings.backgrounds,
    error: settings.serverError
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({
      ...settingsActions,
      ...workspaceActions
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWorkspaceForm)
