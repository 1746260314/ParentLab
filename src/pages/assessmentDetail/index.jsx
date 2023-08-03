import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getAssessmentDetail, getUserProfile } from '../../utils/query'
import { formatTime } from '../../utils/util'
import ShareFixed from '../../components/shareFixed'
import ConfirmModal from '../../components/confirmModal'
import wxIcon from '../../images/wx_icon.png'
import './index.less'

const app = getApp()
export default class Detail extends Component {

  state = {
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    data: {},
    finish_onboarding_survey: true,
    has_kids: true,
    showKidsToast: false,
    showOnboardingToast: false,
  }

  componentWillMount() { }

  componentDidMount() {
    this._getAssessmentDetail(this.state.assessmentID)
  }

  componentWillUnmount() { }

  componentDidShow() { 
    this._getUserProfile()
  }

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

  _getUserProfile = async () => {
    const res = await getUserProfile()
    if (res.status === 'success') {
      const { finish_onboarding_survey, has_kids, has_phone_number } = res.data
      this.setState({
        finish_onboarding_survey,
        has_kids,
        has_phone_number,
      })
    }
  }

  // 点击开始测试
  clickStart = () => {
    const stopOnboardingPrompt = Taro.getStorageSync('stopOnboardingPrompt')
    const stopKidsPrompt = Taro.getStorageSync('stopKidsPrompt')
    const today = formatTime(new Date().getTime(), 'Y-M-D')
    const showOnboardingPrompt = today !== stopOnboardingPrompt
    const showKidsPrompt = today !== stopKidsPrompt
    const { finish_onboarding_survey, has_kids, has_phone_number } = this.state
    if(!has_phone_number) {
      Taro.navigateTo({ url: '/pages/login/index' })
      return
    }
    //如果都填写了，直接开始
    if (finish_onboarding_survey && has_kids) {
      this.onStart()
    } else if (has_kids) {
      if (!finish_onboarding_survey && showOnboardingPrompt) {
        this.setState({ showOnboardingToast: true })
      } else {
        this.onStart()
      }
    } else if (showKidsPrompt) {
      this.setState({ showKidsToast: true })
    } else if (!finish_onboarding_survey) {
      if (showOnboardingPrompt) {
        this.setState({ showOnboardingToast: true })
      } else {
        this.onStart()
      }
    }
  }

  onStart = () => {
    app.td_app_sdk.event({ id: '评测详情-开始答题' });
    try {
      const { assessmentID } = this.state
      const url = `/pages/assessment/index?assessmentID=${assessmentID}`
      Taro.navigateTo({ url })
    } catch (e) {
      // Do something when catch error
    }
  }

  laterOn = () => {
    this.setState({
      showKidsToast: false,
      showOnboardingToast: false
    })
    this.onStart()
  }

  // 设置当天是否提示kids
  setKidsPrompt = (flag) => {
    const value = flag ? formatTime(new Date().getTime(), 'Y-M-D') : ''
    Taro.setStorageSync('stopKidsPrompt', value)
  }

  //去填写孩子信息
  toMyChildren = () => {
    this.setState({ showKidsToast: false })
    const { finish_onboarding_survey, assessmentID } = this.state
    let url = `/pages/myChildren/index?assessmentID=${assessmentID}&version=assessment`
    if (!finish_onboarding_survey) {
      url += '&needOnboarding=yes'
    }
    Taro.navigateTo({ url })
  }

  // 设置当天是否提示Onboarding
  setOnboardingPrompt = (flag) => {
    const value = flag ? formatTime(new Date().getTime(), 'Y-M-D') : ''
    Taro.setStorageSync('stopOnboardingPrompt', value)
  }

  //去填写养育信息
  toMyChildRearing = () => {
    const { assessmentID } = this.state
    this.setState({ showOnboardingToast: false })
    Taro.navigateTo({
      url: `/pages/myChildRearing/index?assessmentID=${assessmentID}&version=assessment`
    })
  }

  render() {
    const { data, showKidsToast, showOnboardingToast } = this.state
    const { body_image_urls = [], is_enabled, is_sharable } = data
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
        {is_sharable && (
          <ShareFixed options={shareOptions} />
        )}

        {showKidsToast && (
          <ConfirmModal
            title='请完善孩子的信息'
            desc={['为了向您提供个性化的养育支持', '我们邀请您完善您的孩子信息']}
            cancelText='稍后'
            saveText='立即填写'
            showPrompt
            setPrompt={this.setKidsPrompt}
            onCancel={this.laterOn}
            onSave={this.toMyChildren}
          />
        )}

        {showOnboardingToast && (
          <ConfirmModal
            title='请完善您的养育基础信息'
            desc={['为了向您提供个性化的养育支持', '我们邀请您完善您的养育基础信息']}
            cancelText='稍后'
            saveText='立即填写'
            showPrompt
            setPrompt={this.setOnboardingPrompt}
            onCancel={this.laterOn}
            onSave={this.toMyChildRearing}
          />
        )}

      </View>
    )
  }
}
