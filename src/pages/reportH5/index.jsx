import Taro from '@tarojs/taro'
import { Component } from 'react'
import { WebView } from '@tarojs/components'

import './index.less'

export default class ReportH5 extends Component {

  state = {
    code: Taro.getCurrentInstance().router.params.code,
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
    const url = process.env.NODE_ENV === 'development' ? 'https://staging-api.parentlab.cn/h5-staging/index.html' : 'https://www.parentlab.cn/h5-prod/index.html'
    // Taro.showToast(
    //   {title: this.state.code}
    // )
    return (
      <WebView src={`${url}?code=${this.state.code}`} />
    )
  }
}