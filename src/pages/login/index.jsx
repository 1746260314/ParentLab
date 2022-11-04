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
    eventID: Taro.getCurrentInstance().router.params.eventID,
    agreed: false,
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleLogin = () => {
    const token = Taro.getStorageSync('token')
    const { agreed } = this.state
    if(!agreed) {
      Taro.showToast({
        title: '请先勾选用户协议',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      !token && login()
      getUserProfile()
    }
  }

  getPhoneNumber = (data) => {
    const { eventID } = this.state
    updatePhoneNumber({code: data.detail.code})
    Taro.redirectTo({url: `/pages/transition/index?eventID=${eventID}`})
  }
  handleChangeAgree = () => {
    this.setState({ agreed: !this.state.agreed })
  }

  goAgreement = () =>  {
    Taro.navigateTo({url: '/pages/userAgreement/index'})
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
          openType='getPhoneNumber'
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
            网站许可及服务协议
          </View>
        </View>
      </View>
    )
  }
}
