import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { logout, getUserProfile, updateUsersWechatInfo } from '../../utils/query'
import NavigatorFixed from '../../components/navigatorFixed'
import UserinfoModal from '../../components/userinfoModal'
import arrowRight from '../../images/arrow_right.png'
import calendarIcon from '../../images/calendar.png'
import orderIcon from '../../images/my_order.png'
import testIcon from '../../images/my_test.png'
import profileIcon from '../../images/my_profile.png'
import children from '../../images/children.png'
import start from '../../images/start.png'
import avatar from '../../images/avatar.png'
import edit from '../../images/edit.png'

import './index.less'

const app = getApp()
export default class PersonalCenter extends Component {

  state = {
    showModal: false,
    avatarUrl: avatar,
    nickname: '用户昵称',
    phone: '',
  }

  componentWillMount() { }

  componentDidMount() {

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
      const { wechat_info: { nickname = '用户昵称', headimgurl = avatar }, profile: { phone = '' } } = res.data
      this.setState({
        nickname: nickname,
        avatarUrl: headimgurl,
        phone
      })
    }
  }

  travelTo = ({ path, TDEventID }) => {
    console.log('path', path);
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

  submit = async ({ avatarUrl, nickname, phone }) => {
    const params = {
      wechat_user: {
        avatarUrl,
        nickname
      },
      profile: {
        phone
      }
    }
    const res = await updateUsersWechatInfo(params)
    if (res.status === 'success') {
      await Taro.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 2000
      })
      this.setState({ avatarUrl, nickname, phone })
    }
    await this.closeModal()
  }

  renderMenu = () => {
    const Menus = [
      // { icon: calendarIcon, label: '我的报名活动', path: '/pages/myRegistered/index' },
      // { icon: orderIcon, label: '我的订单', path: '/pages/myOrder/index', TDEventID: '我的订单' },
      { icon: children, label: '我的孩子', path: '/pages/myChildren/index', TDEventID: '我的孩子' },
      { icon: start, label: '我的养育基础信息', path: '/pages/myChildRearing/index', TDEventID: '我的养育基础信息' },
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
            {item.prompt && (
              <View className='prompt' >
                {item.prompt}
              </View>
            )}
            <Image className='arrow-icon' src={arrowRight} />
          </View>
        </View>
      )
    })
  }

  render() {
    const { showModal, nickname, avatarUrl, phone } = this.state
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
          <UserinfoModal
            onClose={this.closeModal}
            avatarUrl={avatarUrl}
            nickname={nickname}
            phone={phone}
            onSubmit={this.submit}
          />
        )}

        <NavigatorFixed selected={4} />
      </View>
    )
  }
}
