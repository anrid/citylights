'use strict'

import React, { Component } from 'react'
import Radium from 'radium'
// import Color from 'color'
import colors from '../styles/colors'

class Button extends Component {
  static propTypes = {
    kind: React.PropTypes.oneOf(['primary', 'warning']).isRequired
  };

  render () {
    const { kind, children } = this.props
    return (
      <div style={[styles.base, styles[kind]]}>
        {children}
      </div>
    )
  }
}

const styles = {
  base: {
    display: 'inline-block',
    color: 'white',
    background: $c-teal400,
    width: 'auto',
    padding: '0 4px',
    cursor: 'pointer',
    ':hover': {
      background: $c-teal500
    }
  },
  primary: {
    background: $c-blue400,
    ':hover': {
      background: $c-blue500
    }
  },
  warning: {
    background: $c-amber400,
    ':hover': {
      background: $c-amber500
    }
  }
}

// TODO: Use decorators when they’re better supported.
export default Radium(Button)
