import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import customerService from '../../images/customer_service.png'
import './index.less'

export default class CustomerService extends Component {
  handleClick = () => {
    Taro.openCustomerServiceChat({
      extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc3772c1116a398a6b'},
      corpId: 'ww4a9a6e350546d299',
    })
    const { onClick } = this.props;
    onClick && onClick()
  }
  
  render() {
    return (
      <View className='customer-service' onClick={this.handleClick} >
        <Image className='icon' src={customerService} />
      </View>
    )
  }
}
