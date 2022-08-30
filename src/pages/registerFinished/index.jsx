import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { getRegisteredDetail } from '../../utils/query'
import successIcon from '../../images/success_big.png'
import calendarIcon from '../../images/calendar.png'
import './index.less'

export default class RegisterFinished extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
    time: '',
    phone: '18258816337',
  }

  componentWillMount() { }

  componentDidMount() {
    this._getRegisteredDetail(this.state.registerID)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getRegisteredDetail = async (registerID) => {
    const res = await getRegisteredDetail(registerID)
    if(res.status === 'success') {
      this.setState({time: res.data.expected_meeting_time})
    }
  }

  call = () => {
    Taro.makePhoneCall({
      phoneNumber: this.state.phone
    })
  }

  backToTheHomePage = () => {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  // 配置分享
  onShareAppMessage () {
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  render() {
    return (
      <View className='register-finished'>
        <View className='status-wrap'>
          <Image src={successIcon} />
          <Text>预约面谈成功！</Text>
        </View>
        <View className='desc'>
          视频面谈不收取任何费用，面谈信息仅作GP项目使用，且将严格保密。面谈无需特殊准备，只需一个安静的环境和开放的心。
        </View>
        <View className='time'>
          <Image className='icon' src={calendarIcon} />
          我预约的时间：{this.state.time}
        </View>

        <View className='footer'>
          <View className='text'>
            稍后我们的同事将与您电话联系，以确认具体面谈时间，
            请关注您的手机和微信。如有问题可联系客服或拨打电话：
            <View className='phone' onClick={this.call}>
              {this.state.phone}
            </View>
          </View>

          <View className='btn' onClick={this.backToTheHomePage}>
            返回首页
          </View>
        </View>


      </View>
    )
  }
}
