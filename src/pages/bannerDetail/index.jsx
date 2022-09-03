import Taro from '@tarojs/taro'
import { Component } from 'react'
import { WebView } from '@tarojs/components'
import './index.less'

export default class BannerDetail extends Component {

  state = {
    url: Taro.getCurrentInstance().router.params.url,
  }

  componentWillMount() { }

  componentDidMount() { }

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

  render() {

    return (
      <WebView src={this.state.url} />
    )
  }
}
