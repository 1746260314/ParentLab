import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getEventForID } from '../../utils/query'
import CustomerService from '../../components/customerService'

import './index.less'

export default class Detail extends Component {

  state = {
    eventID: Taro.getCurrentInstance().router.params.id,
    data: {},
  }

  componentWillMount() { }

  componentDidMount() {
    this._getEventForID(this.state.eventID)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getEventForID = async (eventID) => {
    const res = await getEventForID(eventID)
    if (res.status === 'success') {
      this.setState({ data: res.data })
      Taro.setNavigationBarTitle({
        title: res.data.event.title
      })
    }
  }

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: this.state.data.event.wechat_share_title,
      path: `/pages/detail/index?id=${this.state.eventID}`,
      imageUrl: this.state.data.event.wechat_share_image_url
    }
  }

  signUp = () => {
    const { eventID } = this.state
    try {
      const token = Taro.getStorageSync('token')
      const hasUserWeChatInfo = Taro.getStorageSync('hasUserWeChatInfo')
      if (token && hasUserWeChatInfo) {
        Taro.navigateTo({ url: `/pages/transition/index?eventID=${eventID}` })
      } else {
        Taro.navigateTo({ url: `/pages/login/index?eventID=${eventID}` })
      }
    } catch (e) {
      // Do something when catch error
    }
  }

  render() {
    const { data } = this.state
    const { event_images = [], event = {} } = data
    return (
      <View className='detail'>
        <CustomerService />
        {event_images.map((img, index) => (
          <Image className='detail-img' src={img} key={index} mode='widthFix' />
        ))}
        <View className='btn-wrap'>
          {event.allow_registration ? (
            <View className='btn' onClick={this.signUp}>
              我要报名
            </View>
          ) : (
            <View className='btn-disable'>
              即将上线，敬请关注
            </View>
          )}
        </View>
      </View>
    )
  }
}
