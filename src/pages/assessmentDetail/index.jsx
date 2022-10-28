import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, PageContainer, Button } from '@tarojs/components'
import { getAssessmentDetail } from '../../utils/query'
import { login, getUserProfile } from '../../utils'
import ShareContainer from '../../components/shareContainer'
import wxIcon from '../../images/wx_icon.png'
import './index.less'

export default class Detail extends Component {

  state = {
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    data: {},
  }

  componentWillMount() { }

  componentDidMount() {
    this._getAssessmentDetail(this.state.assessmentID)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      const { data: { wechat_share_title, wechat_share_image_url }, assessmentID } = this.state
      return {
        title: wechat_share_title,
        path: `/pages/assessmentDetail/index?assessmentID=${assessmentID}`,
        imageUrl: wechat_share_image_url
      }
    }
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  _getAssessmentDetail = async (assessmentID) => {
    const res = await getAssessmentDetail(assessmentID)
    if (res.status === 'success') {
      this.setState({ data: res.data })
      Taro.setNavigationBarTitle({
        title: res.data.title
      })
    }
  }

  clickStart = () => {
    try {
      const token = Taro.getStorageSync('token')
      const hasUserWeChatInfo = Taro.getStorageSync('hasUserWeChatInfo')
      if (token && hasUserWeChatInfo) {
        this.handleStart()
      } else {
        !token && login()
        getUserProfile(this.handleStart)
      }
    } catch (e) {
      // Do something when catch error
    }
  }

  handleStart = () => {
    Taro.navigateTo({
      url: `/pages/assessment/index?assessmentID=${this.state.assessmentID}`
    })
  }

  render() {
    const { data } = this.state
    const { body_image_urls = [], is_enabled } = data
    const shareOptions = [
      {
        icon: wxIcon,
        text: '邀请好友测一测',
        type: 'assessment'
      }
    ]
    return (
      <View className='detail'>
        {body_image_urls.map((img, index) => (
          <Image className='detail-img' src={img} key={index} mode='widthFix' />
        ))}
        <View className='btn-wrap'>
          {is_enabled ? (
            <View className='btn' onClick={this.clickStart}>
              开始答题
            </View>
          ) : (
            <View className='btn-disable'>
              即将上线，敬请关注
            </View>
          )}
        </View>

        <ShareContainer options={shareOptions} />
      </View>
    )
  }
}