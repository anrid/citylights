'use strict'

import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  PropTypes
} from 'react-native'

export default class Button extends Component {
  render () {
    const {
      onPress,
      children,
      isSiblingRight,
      isSiblingBottom } = this.props
    return (
      <TouchableOpacity
        style={[
          styles.button,
          isSiblingRight ? styles.isSiblingRight : { },
          isSiblingBottom ? styles.isSiblingBottom : { }
        ]}
        onPress={onPress}>
        <Text style={styles.buttonText}>
          {children}
        </Text>
      </TouchableOpacity>
    )
  }
}

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  isSiblingRight: PropTypes.bool,
  isSiblingBottom: PropTypes.bool
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    paddingLeft: 18,
    paddingRight: 18,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    shadowColor: 'black',
    shadowOpacity: 0.35,
    shadowRadius: 1.5,
    shadowOffset: { width: 1, height: 2.5 }
  },
  buttonText: {
    color: 'rgba(30, 30, 30, 1)',
    fontSize: 18,
    height: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(150, 150, 150, 0.5)',
    textShadowRadius: 1,
    textShadowOffset: { width: 0, height: 1.25 }
  },
  isSiblingRight: {
    marginLeft: 3
  },
  isSiblingBottom: {
    marginTop: 3
  }
})
