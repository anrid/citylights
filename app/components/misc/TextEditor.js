
import React from 'react'
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw
} from 'draft-js'

import './TextEditor.scss'

export default class TextEditor extends React.Component {
  constructor (props) {
    super(props)

    if (props.defaultValue) {
      const content = convertFromRaw(JSON.parse(props.defaultValue))
      this.state = { editorState: EditorState.createWithContent(content) }
    } else {
      this.state = { editorState: EditorState.createEmpty() }
    }

    this.onChange = (editorState) => {
      // const content = editorState.getCurrentContent()
      // console.log('content=', content)
      this.setState({editorState})
    }

    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  onBlur () {
    const rawContent = convertToRaw(this.state.editorState.getCurrentContent())
    const jsonString = JSON.stringify(rawContent)
    const { onSave, defaultValue } = this.props
    if (defaultValue !== rawContent) {
      onSave(jsonString)
    }
  }

  handleKeyCommand (command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }

  render () {
    const { editorState } = this.state
    return (
      <Editor
        onBlur={this.onBlur}
        editorState={editorState}
        handleKeyCommand={this.handleKeyCommand}
        onChange={this.onChange}
      />
    )
  }
}

TextEditor.propTypes = {
  onSave: React.PropTypes.func.isRequired,
  defaultValue: React.PropTypes.string
}
