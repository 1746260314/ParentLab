import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import uncheckIcon from '../../images/checkbox_uncheck.png'
import selectedIcon from '../../images/checkbox_selected.png'
import './index.less'

export default class ConfirmModal extends Component {

  state = {
    prompt: false,
  }

  setPrompt = () => {
    this.setState({ prompt: !this.state.prompt })
    this.props.setPrompt(!this.state.prompt)
  }

  render() {
    const { title, desc, cancelText, saveText, onCancel, onSave, showPrompt } = this.props
    const { prompt } = this.state
    return (
      <View className='mask'>
        <View className='content'>
          <View className='title'>
            {title}
          </View>
          {desc.map((item, index) => (
            <View className='desc' key={index}>
              {item}
            </View>
          ))}

          {showPrompt && (
            <View 
              className='prompt-bar'
              onClick={this.setPrompt}
            >
              <Image
                className='option-icon'
                src={prompt ? selectedIcon : uncheckIcon}
              />
              24小时内不再提示
            </View>
          )}

          <View className='btn-wrap'>
            <View
              className='btn cancel'
              onClick={onCancel}
            >
              {cancelText}
            </View>

            <View
              className='btn save'
              onClick={onSave}
            >
              {saveText}
            </View>
          </View>

        </View>
      </View>
    )
  }
}
