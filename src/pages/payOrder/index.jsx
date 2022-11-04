import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getOrderInfo, getWeChatPayParams } from '../../utils/query'
import ConfirmModal from '../../components/confirmModal'
import uncheck from '../../images/checkbox_uncheck.png'
import selected from '../../images/checkbox_selected.png'
import './index.less'

export default class PayOrder extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
    order: {},
    agreed: false,
    showModal: false,
    countdown: '00:00:00',
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
      this.countTime(res.data.create_at_timestamps)
    }
  }

  countTime = (create) => {
    let hours, minutes, seconds;
    let that = this;
    let now = parseInt(new Date().getTime() / 1000);
    let end = create + 86400; //设置截止时间
    let leftTime = end - now; //时间差                         
    if (leftTime >= 0) {
      hours = Math.floor(leftTime / 60 / 60 % 24);
      minutes = Math.floor(leftTime / 60 % 60);
      seconds = Math.floor(leftTime % 60);
      seconds = seconds < 10 ? "0" + seconds : seconds
      minutes = minutes < 10 ? "0" + minutes : minutes
      hours = hours < 10 ? "0" + hours : hours
      that.setState({
        countdown: hours + ":" + minutes + ":" + seconds,
      })
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(that.countTime, 1000);
    } else {
      that.setState({
        countdown: '00:00:00'
      })
      Taro.redirectTo({
        url:`/pages/orderExpired/index?registerID=${that.state.registerID}`
      })
    }
 }

  handlePay = async () => {
    const { agreed, registerID } = this.state
    if (!agreed) return
    Taro.showLoading({
      title: 'loading...',
      mask: true
    })
    const res = await getWeChatPayParams(registerID)
    if (res.status === 'success') {
      const { timeStamp, nonceStr, signType, paySign } = res.data
      const _this = this
      Taro.requestPayment({
        timeStamp,
        nonceStr,
        package: res.data.package,
        signType,
        paySign,
        success: function (resSucc) {
          console.log('success:', resSucc)
          Taro.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
          Taro.redirectTo({ url: `/pages/paymentSuccess/index?registerID=${registerID}` })
        },
        fail: function (resFail) {
          console.log('fail:', resFail)
          if (resFail.errMsg === "requestPayment:fail cancel") {
            _this.onShow()
          } else {
            Taro.showToast({
              title: '支付失败',
              icon: 'error',
              duration: 2000
            })
          }
        }
      })
    }
    await Taro.hideLoading()
  }

  handleChangeAgree = () => {
    this.setState({ agreed: !this.state.agreed })
  }

  onShow = () => {
    this.setState({ showModal: true })
  }

  onHide = () => {
    this.setState({ showModal: false })
  }

  handleCancel = () => {
    const { order } = this.state
    Taro.redirectTo({ url: `/pages/detail/index?id=${order.event_id}` })
  }

  handleSave = () => {
    this.onHide()
    this.handlePay()
  }

  goAgreement = () =>  {
    Taro.navigateTo({url: '/pages/orderAgreement/index'})
  }

  render() {
    const { order, agreed, showModal, countdown } = this.state
    return (
      <View className='pay-order'>
        <View className='info-wrap'>
          <View className='order-info'>
            <View className='count-down'>
              请在
              <View className='count-down-num'>
                {countdown}
              </View>
              内支付订单
            </View>

            <View className='event-title'>
              {order.event_title}
            </View>
            {/* <View className='user-name'>
              报名人：{order.user_name}
            </View> */}

            {/* <View className='address-and-time'>
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
            </View> */}

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


        <View className='pay-btn-wrap'>
          {/* <View className='prompt'>
            还剩
            <Text className='emphasize'>
              {order.remaining_participants}
            </Text>
            个名额，请在
            <Text className='emphasize'>
              48
            </Text>
            小时内支付
          </View> */}
          <View
            className={agreed ? 'pay-btn' : 'pay-btn disabled'}
            onClick={this.handlePay}
          >
            支付{(order.total_price?.cents / 100).toFixed(2)}
          </View>
          <View className='agreement'>
            <View
              className='hotspot'
              onClick={this.handleChangeAgree}
            >
              <Image className='icon' src={agreed ? selected : uncheck} />
              已同意
            </View>
            <View className='link'  onClick={this.goAgreement}>
              用户服务协议
            </View>
          </View>
        </View>
        {showModal && (
          <ConfirmModal
            title='是否放弃支付'
            desc={['您还没有支付', '名额有限请确认是否放弃本次支付']}
            cancelText='放弃'
            saveText='继续支付'
            onCancel={this.handleCancel}
            onSave={this.handleSave}
          />
        )}
      </View>
    )
  }
}
