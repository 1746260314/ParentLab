import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import noDataIcon from '../../images/no_data.png'
import './index.less'

export default class Empty extends Component {

  render() {
  
    return (
      <View className='empty'>
      <Image className='icon' src={noDataIcon} />
      <View className='text'>
        暂无数据
      </View>
    </View>
    )
  }
}
