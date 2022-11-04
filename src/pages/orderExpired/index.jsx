import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getOrderInfo } from '../../utils/query'
import expiredIcon from '../../images/expired.png'

import './index.less'

export default class OrderExpired extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID || 140,
    order: {},
  }

  componentWillMount() { }

  componentDidMount() {
    this._getOrderInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage() {
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  _getOrderInfo = async () => {
    const res = await getOrderInfo(this.state.registerID)
    if (res.status === 'success') {
      this.setState({ order: res.data })
    }
  }

  goToDetail = () => {
    Taro.reLaunch({
      url: `/pages/detail/index?id=${this.state.order.event_id}`
    })
  }

  render() {
    const { order } = this.state
    return (
      <View className='pay-order'>
        <View className='info-wrap'>
          <View className='order-info'>
            <Image className='expired-icon' src={expiredIcon} />
            <View className='event-title'>
              {order.event_title}
            </View>
            <View className='sku'>
              {(order.hold_city || '') + order.hold_time}
            </View>
          </View>

          <View className='price-info'>
            <View className='price-bar'>
              <View className='label'>
                原价
              </View>
              <View className='price'>
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
                限时优惠价格
              </View>
              <View className='price'>
                -
                <View className='units'>
                  ￥
                </View>
                <View className='num'>
                  {(order.promotion_price?.cents / 100).toFixed(2)}
                </View>
              </View>
            </View>
            <View className='price-bar'>
              <View className='label'>

              </View>
              <View className='total-price'>
                实付
                <View className='units'>
                  ￥
                </View>
                <View className='num'>
                  {(order.total_price?.cents / 100).toFixed(2)}
                </View>
              </View>
            </View>
          </View>

          <View className='order-num'>
            <View className='label'>
              订单编号
            </View>
            <View className='num'>
              {order.order_num}
            </View>
          </View>
        </View>

        <View className='back-btn' onClick={this.goToDetail}>
          活动详情
        </View>
      </View>
    )
  }
}
