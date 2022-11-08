import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button, RichText } from '@tarojs/components'
import { getPaidOrderInfo, initiateRefund } from '../../utils/query'
import { formatTime } from '../../utils/util'
import CustomerService from '../../components/customerService'
import successIcon from '../../images/success_white.png'
import copyIcon from '../../images/copy.png'
import wechatIcon from '../../images/wechat_green.png'

import './index.less'

export default class PaymentSuccess extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
    order: {},
    show: false
  }

  componentWillMount() { }

  componentDidMount() {}

  componentWillUnmount() { }

  componentDidShow() { 
    this._getPaidOrderInfo()
  }

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

  // 去填写问卷
  handleAnswer = () => {
    const { registerID, order } = this.state
    Taro.navigateTo({ url: `/pages/questionnaire/index?eventID=${order.event_id}&registerID=${registerID}` })
  }

  goHome = () => {
    Taro.reLaunch({ url: '/pages/index/index' })
  }

  render() {
    const { order, show } = this.state
    return (
      <View className='payment-success'>
        <CustomerService />

        <View className='order-detail'>
          <View className='status-bar'>
            <Image className='icon' src={successIcon} />
            支付成功！
          </View>

          <View className='title-bar'>
            <View className='title'>
              {order.event_title}
            </View>

            <View
              className='drawback-btn'
              onClick={this.handleRefund}
            >
              退款
            </View>
          </View>
          <View className='opening'></View>
        </View>

        <View className='bill'>
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

        <View className='order-info'>
          <View className='block-title'>
            订单信息
          </View>
          <View className='item'>
            <View className='label'>
              订单编号
            </View>
            <View className='value'>
              {order.order_num}
            </View>
          </View>
          <View className='item'>
            <View className='label'>
              下单时间
            </View>
            <View className='value'>
              {order.created_at && formatTime(new Date(order.created_at).getTime(), 'Y/M/D h:m')}
            </View>
          </View>
          <View className='item'>
            <View className='label'>
              活动地点
            </View>
            <View className='value'>
              {order.hold_form === 'online' ? '线上' : order.hold_city}
            </View>
          </View>
        </View>

        {order.customer_service_wechat_id && (
          <View className='support-staff'>
            <View className='block-title'>
              添加您的专属客服
            </View>
            <View className='wechat-bar'>
              <Image className='wechat-icon' src={wechatIcon} />
              <View className='wechat-num'>
                {order.customer_service_wechat_id}
              </View>
              <View
                className='operation'
                onClick={this.handleCopy}
              >
                <Image className='copy-icon' src={copyIcon} />
                复制
              </View>
            </View>
            <View className='tips'>
              请点击复制添加您的专属客服微信
            </View>
          </View>
        )}

        {order.need_questionnaire && (
          <View className='questions'>
            <View className='block-title'>
              调查问卷
            </View>
            <View className='btn-bar'>
              <View className='desc'>
                为了您更好地使用我们的产品，上课前请填写一份专属问卷
              </View>
              <View className='btn' onClick={this.handleAnswer}>
                填写
              </View>
            </View>
          </View>
        )}

        <View className='invite'>
          <View className='block-title'>
            邀请好友
          </View>
          <View className='btn-bar'>
            <View className='desc'>
              您可以邀请您的好友一起参加我们的课程
            </View>
            <Button
              openType='share'
              className='btn'
            >
              立即邀请
            </Button>
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

        <View className='back-btn' onClick={this.goHome}>
          返回首页
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
