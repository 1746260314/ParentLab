import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button } from '@tarojs/components'
import { PLInput } from '../formElements'
import { getUserProfile, updateUsersWechatInfo } from '../../utils/query'

import arrowLift from '../../images/arrow_lift.png'
import editAvatorIcon from '../../images/edit_avator.png'
import './index.less'

export default class UserinfoModal extends Component {

  state = {
    avatarUrl: this.props.avatarUrl,
    nickname: this.props.nickname,
    phone: this.props.phone,
  }

  onChooseAvatar = (e) => {
    const { avatarUrl } = e.detail
    this.setState({ avatarUrl })
  }

  handleChangeNickname = (e) => {
    const { value } = e.target
    this.setState({ nickname: value })
  }

  handleChangePhone = (e) => {
    const { value } = e.target
    this.setState({ phone: value })
  }

  // 提交
  submit = async () => {
    const { nickname, phone } = this.state
    if (!(nickname && phone)) return
    this.props.onSubmit(this.state)
  }

  render() {
    const { nickname, avatarUrl, phone } = this.state
    const disabled = !(nickname && phone)
    return (
      <View className='userinfo-modal-mask'>
        <View className='modal'>
          <Image
            className='close-btn'
            src={arrowLift}
            onClick={this.props.onClose}
          />
          <View className='avatar-wrap'>
            <Image className='edit' src={editAvatorIcon} />
            <Button
              className='avatar-btn'
              openType='chooseAvatar'
              onChooseAvatar={this.onChooseAvatar}
            >
              <Image className='avatar' src={avatarUrl} />
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

          <View className='user-name-bar'>
            <View className='label'>
              手机号
            </View>
            <PLInput
              type='number'
              value={phone}
              handleChange={this.handleChangePhone}
            />
          </View>

          <View
            className={`submit-btn ${disabled ? 'submit-btn-disabled' : ''}`}
            onClick={this.submit}
          >
            保存
          </View>
        </View>
      </View>
    )
  }
}
