import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { PLInput } from '../../components/formElements'
import { logout, getUserProfile, updateUsersWechatInfo } from '../../utils/query'
import NavigatorFixed from '../../components/navigatorFixed'
import arrowRight from '../../images/arrow_right.png'
import calendarIcon from '../../images/calendar.png'
import orderIcon from '../../images/my_order.png'
import testIcon from '../../images/my_test.png'
import profileIcon from '../../images/my_profile.png'
import avatar from '../../images/avatar.png'
import edit from '../../images/edit.png'
import arrowLift from '../../images/arrow_lift.png'
import editAvatorIcon from '../../images/edit_avator.png'
import './index.less'

const app = getApp()
export default class PersonalCenter extends Component {

  state = {
    showModal: false,
    avatarUrl: avatar,
    nickname: '用户昵称'
  }

  componentWillMount() { }

  componentDidMount() {
    var token = Taro.getStorageSync('token')
    if(!token) {
      Taro.redirectTo({ url: '/pages/login/index?redirectUrl=/pages/personalCenter/index' })
    }
  }

  componentWillUnmount() { }

  componentDidShow() { 
    this._getUserProfile()
  }

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

  _getUserProfile = async () => {
    const res = await getUserProfile()
    if (res.status === 'success') {
      const { wechat_info = {} } = res.data
      this.setState({
        nickname: wechat_info.nickname || '用户昵称',
        avatarUrl: wechat_info.headimgurl
      })
    }
  }

  travelTo = ({ path, TDEventID }) => {
    if (TDEventID) {
      app.td_app_sdk.event({ id: `个人中心-${TDEventID}` });
    }
    if (path) {
      Taro.navigateTo({ url: path })
    } else {
      Taro.showToast({
        title: '敬请期待。。。',
        icon: 'none',
        duration: 2000
      })
    }
  }

  _logout = async () => {
    const res = await logout()
    if (res.status === 'success') {
      await Taro.showToast({
        title: '退出成功',
        icon: 'success',
        duration: 2000
      })
      this.setState({
        avatarUrl: avatar,
        nickname: '用户昵称'
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
    await Taro.removeStorageSync('hasUserPhoneNumber')
    await Taro.redirectTo({
      url: '/pages/index/index'
    })
  }

  handleEdit = () => {
    this.setState({ showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  onChooseAvatar = (e) => {
    const { avatarUrl } = e.detail
    this.setState({ avatarUrl })
  }

  handleChangeNickname = (e) => {
    const { value } = e.target
    
    this.setState({ nickname: value })
  }

  submit = async () => {
    const { nickname, avatarUrl } = this.state
    this.closeModal()
    const params = {
      wechat_user: {
        headimgurl: avatarUrl,
        nickname,
      }
    }
    const res = await updateUsersWechatInfo(params)
    if (res.status === 'success') {
      await Taro.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      })
    }
  }

  renderMenu = () => {
    const Menus = [
      // { icon: calendarIcon, label: '我的报名活动', path: '/pages/myRegistered/index' },
      { icon: orderIcon, label: '我的订单', path: '/pages/myOrder/index', TDEventID: '订单列表' },
      { icon: testIcon, label: '我的测评', path: '/pages/myAssessment/index', TDEventID: '我的测评' },
      // { icon: profileIcon, label: '我的基本信息', path: '/pages/myProfile/index' },
    ]
    return Menus.map(item => {
      return (
        <View className='menu-item' key={item.title} onClick={() => this.travelTo(item)}>
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

  render() {
    const { showModal, nickname, avatarUrl } = this.state
    return (
      <View className='personal-center'>
        <View
          className='user-bar'
          onClick={this.handleEdit}
        >
          <View className='user-info'>
            <Image className='avatar' src={avatarUrl} />
            <View className='user-name'>
              {nickname}
            </View>
          </View>
          <Image className='edit-icon' src={edit} />
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

        {showModal && (
          <View className='mask'>
            <View className='modal'>
              <Image
                className='close-btn'
                src={arrowLift}
                onClick={this.closeModal}
              />
              <View className='avatar-wrap'>
                <Image className='edit' src={editAvatorIcon} />
                <Button
                  className='avatar-btn'
                  openType='chooseAvatar'
                  onChooseAvatar={this.onChooseAvatar}
                >
                  <Image className='avatar' src={avatarUrl || avatar} />
                </Button>
              </View>

              <View className='user-name-bar'>
                <View className='label'>
                  我的昵称
                </View>
                <PLInput
                  type='nickname'
                  value={nickname}
                  handleChange={this.handleChangeNickname}
                />
              </View>

              <View
                className='submit-btn'
                onClick={this.submit}
              >
                保存
              </View>
            </View>
          </View>
        )}

        <NavigatorFixed selected={4} />
      </View>
    )
  }
}
