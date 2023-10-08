import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import NavigatorFixed from '../../components/navigatorFixed'
import { getHomeLinks, getHomeSetting } from '../../utils/query'
import lockIcon from '../../images/lock.png'
import './index.less'

const app = getApp()
export default class GrowthCamp extends Component {

  state = {
    setting: {},
    list: [],
    isFixed: false,
    screenHeight: ''
  }

  componentWillMount() { }

  componentDidMount() {
    this._getHomeSetting()
    this._getHomeLinks()
    Taro.getSystemInfo({
      success: res => {
        this.setState({ screenHeight: res.screenHeight })
      }
    })
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

  _getHomeSetting = async () => {
    const res = await getHomeSetting('growth_camp')
    if (res.status === 'success') {
      this.setState({ setting: res.data })
    }
  }

  _getHomeLinks = async () => {
    const res = await getHomeLinks('growth_camp')
    if (res.status === 'success') {
      this.setState({ list: res.data })
    }
  }

  onPageScroll = (e) => {
    let scrollTop = parseInt(e.scrollTop)
    const { screenHeight, isFixed } = this.state
    if (scrollTop > screenHeight && !isFixed) {
      this.setState({ isFixed: true })
    }
    if (scrollTop < screenHeight && isFixed) {
      this.setState({ isFixed: false })
    }
  }

  travelTo = (url) => {
    if(!url) return
    Taro.openCustomerServiceChat({
      extInfo: { url: url },
      corpId: 'ww4a9a6e350546d299',
    })
  }

  render() {
    const { setting, list, isFixed } = this.state
    return (
      <View className='growth-camp'>
        <View className='list'>
          {list.map((item, index) => (
            <Image
              key={index}
              src={item.banner_image_url}
              onClick={() => this.travelTo(item.customer_service_link)}
              mode='widthFix'
            />
          ))}
        </View>
        {setting.value2 && (
          <View className={isFixed ? 'btn-wrap fixed' : 'btn-wrap'}>
            <View
              className='btn'
              onClick={() => this.travelTo(setting.value2)}
            >
              <Image className='btn-icon' src={lockIcon} />
              {setting.value1 || '点击了解更多详情'}
            </View>
          </View>
        )}
        <NavigatorFixed selected={1} onClick={this.clickNavigatorEventTracking} />
      </View>
    )
  }
}
