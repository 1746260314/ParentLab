import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { PLInput } from '../formElements'
import { getUserProfile, updateUsersWechatInfo } from '../../utils/query'

import avatar from '../../images/avatar.png'
import arrowLift from '../../images/arrow_lift.png'
import editAvatorIcon from '../../images/edit_avator.png'
import './index.less'

export default class PersonalCenter extends Component {

  state = {
    avatarUrl: avatar,
    nickname: '用户昵称'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    this._getUserProfile()
  }

  componentDidHide() { }

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

  // 提交
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

  render() {
    const { nickname, avatarUrl } = this.state
    return (
      <View className='userinfo-modal-mask'>
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
    )
  }
}
