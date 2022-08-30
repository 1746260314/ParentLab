import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class FormItem extends Component {

  render() {
    const { num, required, title, ps, subtitle, children, error } = this.props
    return (
      <View className='form-item'>
        <View className='title-wrap'>
          <Text className='num'>
            {num}
            {required && <Text className='required'>* </Text>}
          </Text>
          <Text className='title'>
            {title}
          </Text>
          <Text className='ps'>
            {ps}
          </Text>
          {subtitle &&
            <View className='subtitle'>
              {subtitle}
            </View>
          }
        </View>
        {children}
        {error && <View className='error'>
          {error}
        </View>
        }
      </View>
    )
  }
}
