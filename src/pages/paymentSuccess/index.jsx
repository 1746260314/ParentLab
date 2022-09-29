import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button, RichText } from '@tarojs/components'
import { getPaidOrderInfo, initiateRefund } from '../../utils/query'
import CustomerService from '../../components/customerService'
import addressIcon from '../../images/address.png'
import successIcon from '../../images/success_white.png'
import shareIcon from '../../images/share.png'
import copyIcon from '../../images/copy.png'
import navigationIcon from '../../images/navigation.png'

import './index.less'

export default class PaymentSuccess extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID || 141,
    order: {},
    show: false
  }

  componentWillMount() { }

  componentDidMount() {
    this._getPaidOrderInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getPaidOrderInfo = async () => {
    const res = await getPaidOrderInfo(this.state.registerID)
    if (res.status === 'success') {
      this.setState({ order: res.data })
    }
  }

  // 配置分享
  onShareAppMessage() {
    const { order: { wechat_share_title, wechat_share_image_url }, event_id } = this.state
    return {
      title: wechat_share_title,
      path: `/pages/detail/index?id=${event_id}`,
      imageUrl: wechat_share_image_url
    }
  }

  handleRefund = async () => {
    const res = await initiateRefund(this.state.registerID)
    if (res.status === 'success') {
      this.setState({ show: true })
    }
  }

  handleCopy = () => {
    const wechatID = this.state.order.customer_service_wechat_id
    if (wechatID) {
      Taro.setClipboardData({
        data: this.state.order.customer_service_wechat_id,
        success: function (res) {
          Taro.showToast({
            title: '复制成功，请前往微信添加客服为好友',
            icon: 'none',
            duration: 3000
          })
        }
      })
    } else {
      Taro.showToast({
        title: '请联系在线客服',
        icon: 'none',
        duration: 3000
      })
    }
  }

  handleNavigation = () => {
    Taro.showToast({
      title: '敬请期待。。。',
      icon: 'none',
      duration: 2000
    })
  }

  clickMaskBtn = () => {
    this.setState({ show: false })
  }

  render() {
    const { order, show } = this.state
    return (
      <View className='payment-success'>
        <CustomerService />
        <View className='order-info'>

          <View className='status-bar'>
            <Image className='icon' src={successIcon} />
            订单已支付
          </View>

          <View className='title-bar'>
            <View className='title'>
              {order.event_title}GREAT!ParentingGREAT!ParentingGREAT!Parenting
            </View>

            <View
              className='drawback-btn'
              onClick={this.handleRefund}
            >
              退款
            </View>

          </View>
          <View className='user-name'>
            报名人：{order.user_name}
          </View>

          <View className='order-content'>

            {order.hold_form === 'online' ? (
              <View className='content-bar'>
                <View className='content'>
                  <View className='desc'>
                    请您添加客服微信号预约课程
                  </View>
                  <View className='wechat-id'>
                    {order.customer_service_wechat_id}
                  </View>
                </View>
                <View
                  className='operation'
                  onClick={this.handleCopy}
                >
                  <Image className='icon' src={copyIcon} />
                  复制
                </View>
              </View>
            ) : (
              <View className='content-bar'>
                <View className='content'>
                  <View className='city'>
                    {order.hold_city}
                  </View>
                  <View className='address-bar'>
                    <Image className='icon' src={addressIcon} />
                    <View className='address'>
                      {order.hold_address}
                    </View>

                  </View>
                </View>
                <View
                  className='operation'
                  onClick={this.handleNavigation}
                >
                  <Image className='icon' src={navigationIcon} />
                  导航
                </View>
              </View>
            )}

            <View className='time'>
              {order.hold_time}
            </View>
          </View>
        </View>

        {order.sku_description && (
          <View className='activity-guidelines'>
            <View className='title'>
              活动须知
            </View>
            <View className='guidelines'>
              <RichText nodes={order.sku_description} />
            </View>
          </View>
        )}

        <View className='btn-wrap'>
          <Button
            openType='share'
            className='pay-btn'
            onClick={this.handlePay}
          >
            <Image className='icon' src={shareIcon} />
            邀请我的好友一起参加
          </Button>
        </View>

        {show && (
          <View
            className='mask'
            onClick={this.onHide}
          >
            <View
              className='result-wrap'
              onClick={e => e.stopPropagation()}
            >
              <View className='result-title'>
                订单退款
              </View>

              <View className='result-desc'>
                我们已收到您的退款申请，工作人员将在5个工作日内与您联系，沟通退款事宜，请您耐心等待。
              </View>

              <View
                className='result-btn'
                onClick={this.clickMaskBtn}
              >
                我知道了
              </View>
            </View>

          </View>
        )}
      </View>
    )
  }
}
