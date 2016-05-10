
import React, { Component } from 'react'
import {
  StyleSheet
} from 'react-native'
import Drawer from 'react-native-drawer'
import SideMenuContents from './SideMenuContents'

export default class SideMenuWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedItem: null
    }
    // Bind !
    this.onMenuItemSelected = this.onMenuItemSelected.bind(this)
  }

  onMenuItemSelected (item) {
    this.setState({
      selectedItem: item
    })
    // Close drawer on select.
    this._drawer.close()
  }

  render () {
    const menu = <SideMenuContents {...this.props} onItemSelected={this.onMenuItemSelected} />
    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref
        }}
        type='static'
        content={menu}
        openDrawerOffset={100}
        tweenHandler={Drawer.tweenPresets.parallax}
        captureGestures
        tapToClose
        tweenDuration={100}
        panThreshold={0.025}
        panOpenMask={0.05}
        style={drawerStyles}
      >
        {this.props.children}
      </Drawer>
    )
  }
}

const drawerStyles = StyleSheet.create({
  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
  main: {paddingLeft: 3}
})
