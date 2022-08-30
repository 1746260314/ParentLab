import { Component } from 'react'
import { Input } from '@tarojs/components'
import './index.less'

export default class PLInput extends Component {

  state = {
    focus: false
  }

  handleBlur = (e) => {
    this.setState({ focus: false })
    this.props.handleChange(e)
  }

  handleFocus = () => this.setState({ focus: true })
  render() {
    const { error, handleChange, ...other} = this.props
    const { focus } = this.state

    return (
      <Input
        className={`pl-input ${focus ? 'pl-input-focus' : ''} ${error ? 'pl-input-error' : ''}`}
        {...other}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
      />
    )
  }
}
