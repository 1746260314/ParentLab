import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { logout } from '../../utils/query'
import NavigatorFixed from '../../components/navigatorFixed'
import underline from '../../images/underline.png'
import arrowRight from '../../images/arrow_right.png'
import calendarIcon from '../../images/calendar.png'
import orderIcon from '../../images/my_order.png'
import testIcon from '../../images/my_test.png'
import profileIcon from '../../images/my_profile.png'

import './index.less'

export default class PersonalCenter extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  travelTo = (url) => {
    if (url) {
      Taro.navigateTo({ url })
    } else {
      Taro.showToast({
        title: '敬请期待。。。',
        icon: 'none',
        duration: 2000
      })
    }
  }

  renderMenu = () => {
    const Menus = [
      // { icon: calendarIcon, label: '我的报名活动', path: '/pages/myRegistered/index' },
      { icon: orderIcon, label: '我的订单', path: '/pages/myOrder/index' },
      { icon: testIcon, label: '我的测评', path: '/pages/myAssessment/index' },
      // { icon: profileIcon, label: '我的基本信息', path: '/pages/myProfile/index' },
    ]
    return Menus.map(item => {
      return (
        <View className='menu-item' key={item.title} onClick={() => this.travelTo(item.path)}>
          <Image className='icon' src={item.icon} />
          <View className='label-bar' >
            <View className='label' >
              {item.label}
            </View>
            <Image className='arrow-icon' src={arrowRight} />
          </View>
        </View>
      )
    })
  }

  _logout = async () => {
    const res = await logout()
    if(res.status === 'success') {
      await Taro.showToast({
        title: '退出成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      await Taro.showToast({
        title: '您已退出登录',
        icon: 'error',
        duration: 2000
      })
    }
    await Taro.removeStorageSync('token')
    await Taro.removeStorageSync('hasUserWeChatInfo')
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
    return (
      <View className='personal-center'>
        <View className='title'>
          个人中心
          <Image className='underline' src={underline} />
        </View>

        <View className='menu-wrap'>
          {this.renderMenu()}
        </View>

        <View 
          className='logout'
          onClick={this._logout}
        >
          退出登录
        </View>

        <NavigatorFixed selected={3} />
      </View>
    )
  }
}
