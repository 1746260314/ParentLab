import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { updatePhoneNumber } from '../../utils/query'
import { login, getUserProfile } from '../../utils'
import logo from '../../images/login_logo.png'
import wechatGray from '../../images/wechat_gray.png'
import wechatBlack from '../../images/wechat_black.png'
import uncheck from '../../images/checkbox_uncheck.png'
import selected from '../../images/checkbox_selected.png'
import './index.less'

export default class Login extends Component {

  state = {
    redirectUrl: Taro.getCurrentInstance().router.params.redirectUrl,
    paramsKey: Taro.getCurrentInstance().router.params.paramsKey,
    paramsValue: Taro.getCurrentInstance().router.params.paramsValue,
    agreed: false,
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleLogin = () => {
    const token = Taro.getStorageSync('token')
    const hasUserWeChatInfo = Taro.getStorageSync('hasUserWeChatInfo')
    const { agreed } = this.state
    if (!agreed) {
      Taro.showToast({
        title: '请先勾选《网站许可及服务协议》',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      !token && login()
      !hasUserWeChatInfo && getUserProfile((res) => {
        if (res) {
          const { redirectUrl, paramsKey, paramsValue } = this.state
          const hasUserPhoneNumber = Taro.getStorageSync('hasUserPhoneNumber')
          hasUserPhoneNumber && Taro.redirectTo({ url: `${redirectUrl}?${paramsKey}=${paramsValue}` })
        } else {
          Taro.showToast({
            title: '授权昵称头像失败',
            icon: 'error',
            duration: 2000
          })
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        }
      })
    }
  }

  getPhoneNumber = (data) => {
    if (data.detail.errMsg === "getPhoneNumber:ok") {
      Taro.setStorageSync('hasUserPhoneNumber', true)
      const { redirectUrl, paramsKey, paramsValue } = this.state
      updatePhoneNumber({ code: data.detail.code })
      const hasUserWeChatInfo = Taro.getStorageSync('hasUserWeChatInfo')
      hasUserWeChatInfo && Taro.redirectTo({ url: `${redirectUrl}?${paramsKey}=${paramsValue}` })
    } else {
      Taro.showToast({
        title: '授权手机号失败',
        icon: 'error',
        duration: 2000
      })
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    }

  }
  handleChangeAgree = () => {
    this.setState({ agreed: !this.state.agreed })
  }

  goAgreement = () => {
    Taro.navigateTo({ url: '/pages/userAgreement/index' })
  }

  render() {
    const { agreed } = this.state
    return (
      <View className='login'>
        <View className='bg' />
        <Image className='logo' src={logo} />
        <Button
          className={agreed ? 'btn' : 'btn disabled'}
          onClick={this.handleLogin}
          openType={agreed ? 'getPhoneNumber' : ''}
          onGetPhoneNumber={this.getPhoneNumber}
        >
          <Image className='icon' src={agreed ? wechatBlack : wechatGray} />
          微信用户一键登录
        </Button>
        <View className='agreement'>
          <View
            className='hotspot'
            onClick={this.handleChangeAgree}
          >
            <Image className='icon' src={agreed ? selected : uncheck} />
            同意
          </View>
          <View className='link' onClick={this.goAgreement}>
            《网站许可及服务协议》
          </View>
        </View>
      </View>
    )
  }
}
