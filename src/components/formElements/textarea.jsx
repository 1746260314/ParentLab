import { Component } from 'react'
import { Textarea } from '@tarojs/components'
import './index.less'

export default class PLTextarea extends Component {

  state = {
    focus: false
  }

  handleBlur = () => {
    this.setState({ focus: false })
  }

  handleChange = (e) => {
    this.props.handleChange(e)
  }

  handleFocus = () => this.setState({ focus: true })

  render() {
    const { error, handleChange, ...other } = this.props
    const { focus } = this.state
    return (
      <Textarea
        className={`pl-textarea ${focus ? 'pl-textarea-focus' : ''} ${error ? 'pl-textarea-error' : ''}`}
        {...other}
        onBlur={this.handleBlur}
        onInput={this.handleChange}
        onFocus={this.handleFocus}
      />
    )
  }
}
