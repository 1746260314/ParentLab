import { Component } from 'react'
import { View } from '@tarojs/components'
import './index.less'

export default class AlertModal extends Component {

  render() {
    const { title, desc, btnText, handleClick } = this.props
    return (
      <View className='alert-modal'>
        <View className='alert-content'>
          <View className='title'>
            {title}
          </View>
          <View className='desc'>
            {desc}
          </View>
          <View
            className='btn'
            onClick={handleClick}
          >
            {btnText}
          </View>
        </View>
      </View>
    )
  }
}
