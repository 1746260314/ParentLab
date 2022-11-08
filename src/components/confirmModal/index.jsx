import { Component } from 'react'
import { View } from '@tarojs/components'
import './index.less'

export default class ConfirmModal extends Component {

  render() {
    const { title, desc, cancelText, saveText, onCancel, onSave } = this.props
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
