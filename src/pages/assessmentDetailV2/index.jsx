import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, RichText } from '@tarojs/components'
import { getAssessmentDetail, getAssessmentsShareInfo, getUserProfile } from '../../utils/query'
import { formatTime } from '../../utils/util'
import ShareFixed from '../../components/shareFixed'
import SharePoster from '../../components/sharePoster'
import AlertModal from '../../components/alertModal'
import ConfirmModal from '../../components/confirmModal'
import wxIcon from '../../images/wx_icon.png'
import wxCircleIcon from '../../images/share_icon_circle.png'
import arrowUp from '../../images/arrow_up.png'
import arrowDown from '../../images/arrow_down.png'
import './index.less'

const app = getApp()

export default class AssessmentDetailV2 extends Component {

  state = {
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    data: {},
    assessmentShareData: {},
    showHintPop: false,
    showPoster: false,
    showAlert: false,
    finish_onboarding_survey: true,
    has_kids: true,
    showKidsToast: false,
    showOnboardingToast: false,
    has_phone_number: false,
  }

  componentWillMount() { }

  componentDidMount() {
    const { assessmentID } = this.state
    const showHintPop = !Taro.getStorageSync(`assessment_detail_hint_pop_${assessmentID}`)
    this.setState({ showHintPop })
    this._getAssessmentDetail(assessmentID)
    // 引导分享，六秒后自动关闭
    setTimeout(() => {
      Taro.setStorageSync(`assessment_detail_hint_pop_${assessmentID}`, true)
      this.setState({ showHintPop: false })
    }, 6000)
    this._getAssessmentsShareInfo(assessmentID)
  }

  componentWillUnmount() { }

  componentDidShow() { 
    this._getUserProfile()
  }

  componentDidHide() { }

  // 分享配置
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      app.td_app_sdk.event({ id: 'assessment详情页面-详情分享2' });
      const { assessmentShareData: { mp_share_title, mp_share_image_url }, assessmentID } = this.state
      return {
        title: mp_share_title,
        path: `/pages/assessmentDetailV2/index?assessmentID=${assessmentID}`,
        imageUrl: mp_share_image_url
      }
    }
    app.td_app_sdk.event({ id: 'assessment详情页面-详情分享1' });
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  // 获取测试详情数据
  _getAssessmentDetail = async (assessmentID) => {
    const res = await getAssessmentDetail(assessmentID)
    if (res.status === 'success') {
      this.setState({ data: res.data })
      Taro.setNavigationBarTitle({
        title: res.data.title
      })
    }
  }

  // 获取某测评的分享信息
  _getAssessmentsShareInfo = async (assessmentID) => {
    const res = await getAssessmentsShareInfo(assessmentID)
    if (res.status === 'success') {
      this.setState({ assessmentShareData: res.data })
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

  //展开收起
  control = (id) => {
    this.setState({ [`open${id}`]: !this.state[`open${id}`] })
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
      const url = `/pages/assessmentV2/index?assessmentID=${assessmentID}`
      Taro.navigateTo({ url })
    } catch (e) {
      // Do something when catch error
    }
  }

  // 显示海报弹窗
  showPoster = () => {
    app.td_app_sdk.event({ id: 'assessment详情页面-详情分享3' });
    this.setState({ showPoster: true })
  }

  hidePoster = () => {
    this.setState({ showPoster: false })
  }

  showAlert = () => {
    this.setState({ showAlert: true })
  }

  hideAlert = () => {
    this.setState({ showAlert: false })
  }

  savePosterSuccess = () => {
    this.hidePoster()
    this.showAlert()
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
    let url = `/pages/myChildren/index?assessmentID=${assessmentID}&version=assessmentV2`
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
      url: `/pages/myChildRearing/index?assessmentID=${assessmentID}&version=assessmentV2`
    })
  }

  render() {
    const { data, showHintPop, showPoster, assessmentShareData, showAlert, showKidsToast, showOnboardingToast } = this.state
    const shareOptions = [
      {
        icon: wxIcon,
        text: '邀请好友测一测',
        type: 'assessment'
      }, {
        icon: wxCircleIcon,
        text: '分享到朋友圈',
        type: 'poster'
      }
    ]

    return (
      <View className='detail'>

        {showHintPop && (
          <View className='hint-pop'>
            <View className='pop'>
              点击这里邀请好友一起测一测
            </View>
          </View>
        )}

        <Image className='detail-img' src={data.banner_image_url} mode='widthFix' />

        <View className='container'>
          <View className='tag-bar'>
            {data.tags?.map((tag, index) => (
              <View className='tag' key={index}>{tag}</View>
            ))}
          </View>

          <View className='title'>
            {data.title}
          </View>

          <View className='desc'>
            {data.short_desc}
          </View>

          <View className='quantity-bar'>
            <View className='tag'>
              <View className='quantity-num'>
                {data.assessment_questions_count}道
              </View>
              <View className='quantity-matter'>
                测试题目数量
              </View>
            </View>
            <View className='tag'>
              <View className='quantity-num'>
                {data.duration_minutes}分钟
              </View>
              <View className='quantity-matter'>
                完成所需时间
              </View>
            </View>
          </View>

          {data.references?.length > 0 && (
            <View className='source'>
              <View className='label'>
                文献来源
              </View>
              {data.references.map((item, index) => (
                <View className='item' key={index}>
                  {item}
                </View>
              ))}
            </View>
          )}

          {data.intro_items?.map(item => (
            <View className='description' key={item.id}>
              <View className='title'>
                <View className='decorate'></View>
                {item.title}
              </View>

              {this.state[`open${item.id}`] ? (
                <View className='content'>
                  <RichText nodes={item.content_html} />
                </View>
              ) : (
                <View className='content-hide'>
                  {item.plain_content}
                </View>
              )}

              {item.plain_content.length > 100 && (
                <View
                  className='control'
                  onClick={() => this.control(item.id)}
                >
                  {this.state[`open${item.id}`] ? '收起' : '展开'}
                  <Image className='icon' src={this.state[`open${item.id}`] ? arrowUp : arrowDown} />
                </View>
              )}
            </View>
          ))}
        </View>

        <View className='btn-bar'>
          {data.is_enabled ? (
            <View className='btn' onClick={this.clickStart}>
              开始测试
            </View>
          ) : (
            <View className='btn-disable'>
              即将上线，敬请关注
            </View>
          )}
        </View>

        {data.is_sharable && (
          <ShareFixed options={shareOptions} showPoster={this.showPoster} />
        )}

        {showPoster && (
          <SharePoster poster={assessmentShareData.moment_share_image_url} inviter={assessmentShareData.user} onHide={this.hidePoster} success={this.savePosterSuccess} />
        )}

        {showAlert && (
          <AlertModal title='保存成功' desc='已经保存到手机，到朋友圈炫一把' btnText='我知道了' handleClick={this.hideAlert} />
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
