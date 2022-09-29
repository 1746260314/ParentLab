import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getOrderList } from '../../utils/query'
import { formatTime } from '../../utils/util'
import Empty from '../../components/empty'
import addressIcon from '../../images/address.png'
import './index.less'

export default class MyOrder extends Component {

  state = {
    orders: [],
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    this._getOrderList()
  }

  componentDidHide() { }

  _getOrderList = async () => {
    const res = await getOrderList()
    if (res.status === 'success') {
      this.setState({ orders: res.data })
    }
  }

  goToDetail = (registerID) => {
    Taro.navigateTo({ url: `/pages/paymentSuccess/index?registerID=${registerID}` })
  }

  goToPay = (registerID) => {
    Taro.navigateTo({ url: `/pages/payOrder/index?registerID=${registerID}` })
  }

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

  render() {
    const { orders } = this.state
    return (
      <View className='my-order'>
        {orders.map(order => (
          <View className='order-card' key={order.id}>
            <View className='status-bar'>
              <View className='order-time'>
                {order.registered_at && formatTime(new Date(order.registered_at).getTime(), 'Y/M/D h:m')}
              </View>
              <View className={`status ${order.state === 'paid' ? 'focus' : ''}`}>
                {order.state === 'paid' ? '已支付' : '待支付'}
              </View>
            </View>

            <View className='event-title'>
              {order.event_title}
            </View>

            <View className='address-bar'>
              <Image className='address-icon' src={addressIcon} />
              <View className='address'>
                {order.hold_form === 'offline' ? order.hold_address : '线上活动'}
              </View>
            </View>

            <View className='activity-time'>
              {order.hold_time}
            </View>
            <View className='price-bar'>
              <View className='label'>总费用</View>
              <View className={`currency ${order.state === 'paid' ? 'focus' : ''}`}>
                ￥
              </View>
              <View className={`price ${order.state === 'paid' ? 'focus' : ''}`}>
                {order.list_price?.cents && (order.list_price.cents / 100).toFixed(2)}元
              </View>
            </View>

            {order.state === 'paid' ? (
              <View
                className='detail-btn'
                onClick={() => this.goToDetail(order.id)}
              >
                查看详情
              </View>
            ) : (
              <View
                className='pay-btn'
                onClick={() => this.goToPay(order.id)}
              >
                马上去支付
              </View>
            )}
          </View>
        ))}

        {orders.length === 0 && (
          <Empty />
        )}

      </View>
    )
  }
}
