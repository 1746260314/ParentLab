import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { getOrderInfo } from '../../utils/query'
import addressIcon from '../../images/address.png'
import './index.less'

export default class PayOrder extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
    order: {},
  }

  componentWillMount() { }

  componentDidMount() {
    this._getOrderInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getOrderInfo = async () => {
    const res = await getOrderInfo(this.state.registerID)
    if (res.status === 'success') {
      this.setState({ order: res.data })
    }
  }

  handlePay = () => {
    Taro.showToast({
      title: '敬请期待。。。',
      icon: 'none',
      duration: 2000
    })
  }

  // 配置分享
  onShareAppMessage () {
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  render() {
    const { order } = this.state
    return (
      <View className='pay-order'>
        <View className='info-wrap'>
          <View className='order-info'>
            <View className='event-title'>
              {order.event_title}
            </View>
            <View className='user-name'>
              报名人：{order.user_name}
            </View>

            <View className='address-and-time'>
              <View className='city'>
                {order.hold_form === 'offline' ? order.hold_city : '线上活动'}
              </View>
              {order.hold_form === 'offline' && (
                <View className='address'>
                  <Image className='icon' src={addressIcon} />
                  {order.hold_address}
                </View>
              )}

              <View className='time'>
                {order.hold_time}
              </View>
            </View>

          </View>

          <View className='price-info'>
            <View className='price-bar'>
              <View className='label'>
                原价
              </View>
              <View className='list-price'>
                <View className='units'>
                  ￥
                </View>
                <View className='num'>
                  {(order.list_price?.cents / 100).toFixed(2)}
                </View>
              </View>
            </View>
            <View className='price-bar'>
              <View className='label'>
                优惠价
              </View>
              <View className='promotion-price'>
                <View className='units'>
                  -￥
                </View>
                <View className='num'>
                  {(order.promotion_price?.cents / 100).toFixed(2)}
                </View>
              </View>
            </View>
            <View className='price-bar'>
              <View className='label'>
                总费用
              </View>
              <View className='total-price'>
                <View className='units'>
                  ￥
                </View>
                <View className='num'>
                  {(order.total_price?.cents / 100).toFixed(2)}
                </View>
              </View>
            </View>
          </View>
        </View>


        <View className='pay-btn-wrap'>
          <View className='prompt'>
            还剩
            <Text className='emphasize'>
              12
            </Text>
            个名额，请在
            <Text className='emphasize'>
              48
            </Text>
            小时内支付
          </View>
          <View 
            className='pay-btn' 
            onClick={this.handlePay}
          >
            支付{(order.total_price?.cents / 100).toFixed(2)}
          </View>
        </View>
      </View>
    )
  }
}
