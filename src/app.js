import Taro from '@tarojs/taro'
import { Component } from 'react'
import { login } from './utils'
import { getWeChatSettings } from './utils/query'
import './app.less'

// eslint-disable-next-line no-unused-vars
const tdweapp = require('./utils/tdweapp.js');

class App extends Component {

  componentDidMount() {
    this._getWeChatSettings()
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  onLaunch(options) {
    console.log('options===', options);
    console.log('gdt_vid===', options.gdt_vid);
    let gdt_vid = options.gdt_vid
    login(gdt_vid)
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
