import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { updatePhoneNumber, getUserProfile, updateUsersWechatInfo, updatePhone } from '../../utils/query'
import { isPhone } from '../../utils/util'
import { login } from '../../utils'
import UserinfoModal from '../../components/userinfoModal'
import logo from '../../images/login_logo.png'
import wechatGray from '../../images/wechat_gray.png'
import wechatBlack from '../../images/wechat_black.png'
import uncheck from '../../images/checkbox_uncheck.png'
import selected from '../../images/checkbox_selected.png'
import avatar from '../../images/avatar.png'
import './index.less'

export default class Login extends Component {

  state = {
    redirectUrl: Taro.getCurrentInstance().router.params.redirectUrl,
    paramsKey: Taro.getCurrentInstance().router.params.paramsKey,
    paramsValue: Taro.getCurrentInstance().router.params.paramsValue,
    agreed: false,
    avatarUrl: avatar,
    nickname: '用户昵称',
    showModal: false,
    phone: ''
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 登录
  handleLogin = () => {
    const { agreed } = this.state
    if (!agreed) {
      Taro.showToast({
        title: '请先勾选《网站许可及服务协议》',
        icon: 'none',
        duration: 2000
      })
      return
    }
    const token = Taro.getStorageSync('token')
    !token && login()
  }

  // 获取用户手机号
  getPhoneNumber = async (data) => {
    if (data.detail.errMsg === "getPhoneNumber:ok") {
      Taro.setStorageSync('hasUserPhoneNumber', true)
      await updatePhoneNumber({ code: data.detail.code })
      await this._getUserProfile()
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

  // 获取用户信息
  _getUserProfile = async () => {
    const res = await getUserProfile()
    console.log('res', await getUserProfile());
    if (res.status === 'success') {
      const { wechat_info: { nickname = '用户昵称', headimgurl = avatar }, profile: { phone = '' } } = res.data
      this.setState({
        nickname: nickname,
        avatarUrl: headimgurl,
        phone
      })
      this.openModal()
    }
  }

  openModal = () => {
    this.setState({ showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  submit = async ({ avatarUrl, nickname, phone }) => {
    const params = {
      wechat_user: {
        avatarUrl,
        nickname
      }
    }
    const res = await updateUsersWechatInfo(params)
    if (res.status === 'success') {
      this._updatePhone(phone)
    }
    await this.closeModal()
  }

  _updatePhone = async (phone) => {
    const { redirectUrl, paramsKey, paramsValue } = this.state
    if (isPhone(phone)) {
      const res = await updatePhone({ phone_number: phone })
      if (res.status === 'success') {
        await Taro.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        if (redirectUrl) {
          Taro.redirectTo({ url: `${redirectUrl}?${paramsKey}=${paramsValue}` })
        } else {
          Taro.navigateBack()
        }
      }
    } else {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'error',
        duration: 2000
      })
    }

  }

  // 切换勾选同意协议
  handleChangeAgree = () => {
    this.setState({ agreed: !this.state.agreed })
  }

  // 查看用户协议
  goAgreement = () => {
    Taro.navigateTo({ url: '/pages/userAgreement/index' })
  }

  render() {
    const { agreed, showModal, nickname, avatarUrl, phone } = this.state
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

        {showModal && (
          <UserinfoModal
            onClose={this.closeModal}
            avatarUrl={avatarUrl}
            nickname={nickname}
            phone={phone}
            onSubmit={this.submit}
          />
        )}
      </View>
    )
  }
}
