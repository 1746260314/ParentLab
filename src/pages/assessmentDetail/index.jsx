import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getAssessmentDetail } from '../../utils/query'
import ShareFixed from '../../components/shareFixed'
import wxIcon from '../../images/wx_icon.png'
import './index.less'

const app = getApp()
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
      app.td_app_sdk.event({ id: '评测详情-分享2' });
      const { data: { wechat_share_title, wechat_share_image_url }, assessmentID } = this.state
      return {
        title: wechat_share_title,
        path: `/pages/assessmentDetail/index?assessmentID=${assessmentID}`,
        imageUrl: wechat_share_image_url
      }
    }
    app.td_app_sdk.event({ id: '评测详情-分享1' });
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
    app.td_app_sdk.event({ id: '评测详情-开始答题' });
    try {
      const { assessmentID } = this.state
      const token = Taro.getStorageSync('token')
      const hasUserPhoneNumber = Taro.getStorageSync('hasUserPhoneNumber')
      const url = `/pages/assessment/index?assessmentID=${assessmentID}`
      if (token && hasUserPhoneNumber) {
        Taro.navigateTo({ url })
      } else {
        Taro.navigateTo({ url: `/pages/login/index?&redirectUrl=/pages/assessment/index&paramsKey=assessmentID&paramsValue=${assessmentID}` })
      }
    } catch (e) {
      // Do something when catch error
    }
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

        <ShareFixed options={shareOptions} />
      </View>
    )
  }
}
