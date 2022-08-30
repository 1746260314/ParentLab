import Taro from '@tarojs/taro'
import { Component } from 'react'
import { login } from './utils/weChatLogin'
import { getWeChatSettings } from './utils/query'
import './app.less'

class App extends Component {

  componentDidMount() {
    this._getWeChatSettings()
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  onLaunch() {
    login()
  }

  _getWeChatSettings = async () => {
    const res = await getWeChatSettings()
    if (res.status === 'success') {
      Taro.setStorageSync('shareTitle', res.data.wechat_share_title)
      Taro.setStorageSync('shareImg', res.data.wechat_share_image_url)

    }
  }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App
