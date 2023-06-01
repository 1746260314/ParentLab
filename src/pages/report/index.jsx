import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, RichText } from '@tarojs/components'
import { getReportInfo, getUserProfile, getUserPublicInfo, getAssessmentUserRelationsIsComparable } from '../../utils/query'
import { formatTime } from '../../utils/util'
import ShareFixed from '../../components/shareFixed'
import SharePoster from '../../components/sharePoster'
import AlertModal from '../../components/alertModal'
import underline from '../../images/underline2.png'
import wxIcon from '../../images/wx_icon.png'
import shareReportIcon from '../../images/share_icon_report.png'
import shareCircleIcon from '../../images/share_icon_circle.png'
import './index.less'

const app = getApp()
export default class Report extends Component {

  state = {
    relationsID: Taro.getCurrentInstance().router.params.relationsID,
    inviterOpenid: Taro.getCurrentInstance().router.params.inviterOpenid,
    assessment: {},
    report: {},
    showPoster: false,
    showAlert: false,
    wechatInfo: {},
    inviter: {},
    compareData: {},
    is_sharable: false,
  }

  componentWillMount() { }

  componentDidMount() {
    const { inviterOpenid } = this.state
    this._getReportInfo()
    this._getUserProfile()
    if (inviterOpenid) {
      this._getUserPublicInfo(inviterOpenid)
    }
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      app.td_app_sdk.event({ id: '报告-分享' });
      const { type } = res.target.dataset
      const { assessment, report, relationsID, wechatInfo } = this.state
      if (type === 'assessment') {
        app.td_app_sdk.event({ id: '报告-分享pop1' });
        return {
          title: assessment.wechat_share_title,
          path: `/pages/assessmentDetail/index?assessmentID=${assessment.id}`,
          imageUrl: assessment.wechat_share_image_url
        }
      } else if (type === 'report') {
        app.td_app_sdk.event({ id: '报告-分享pop2' });
        return {
          title: report.mp_share_title,
          path: `/pages/report/index?relationsID=${relationsID}&inviterOpenid=${wechatInfo.openid}`,
          imageUrl: report.mp_share_image_url
        }
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

  // 获测试报告信息
  _getReportInfo = async () => {
    const res = await getReportInfo(this.state.relationsID)
    if (res.status === 'success') {
      const { assessment, report, is_sharable } = res.data
      this.setState({
        report,
        assessment,
        is_sharable
      })
      // this._getAssessmentUserRelationsIsComparable(assessment.id)
      if (this.state.inviterOpenid) {
        Taro.setNavigationBarTitle({
          title: assessment.title
        })
      }
    }
  }

  // 获取某测评对比信息
  _getAssessmentUserRelationsIsComparable = async (assessmentID) => {
    const res = await getAssessmentUserRelationsIsComparable(assessmentID)
    if (res.status === 'success') {
      this.setState({ compareData: res.data })
    }
  }

  // 获取当前用户信息
  _getUserProfile = async () => {
    const res = await getUserProfile()
    if (res.status === 'success') {
      this.setState({ wechatInfo: res.data.wechat_info })
    }
  }

  // 获取邀请人信息
  _getUserPublicInfo = async (inviterOpenid) => {
    const res = await getUserPublicInfo(inviterOpenid)
    if (res.status === 'success') {
      this.setState({ inviter: res.data })
    }
  }

  more = () => {
    app.td_app_sdk.event({ id: '报告-返回按钮' });
    Taro.redirectTo({ url: '/pages/assessmentCenter/index' })
  }

  // 显示海报弹窗
  showPoster = () => {
    app.td_app_sdk.event({ id: '报告-分享pop3' });
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

  saveSuccess = () => {
    this.hidePoster()
    this.showAlert()
  }

  handleAssessment = () => {
    const { assessment } = this.state
    Taro.redirectTo({ url: `/pages/assessmentDetail/index?assessmentID=${assessment.id}` })
  }

  viewComparison = () => {
    Taro.navigateTo({ url: `/pages/comparison/index?relationsID=${this.state.relationsID}&assessmentID=${this.state.assessment.id}` })
  }

  render() {
    const { report, inviterOpenid, assessment, inviter, showPoster, wechatInfo, showAlert, compareData: { is_comparable, first_test_at }, is_sharable } = this.state
    const shareOptions = [{
      icon: wxIcon,
      text: '邀请好友测一测',
      type: 'assessment'
    }, {
      icon: shareReportIcon,
      text: '分享报告',
      type: 'report'
    }, {
      icon: shareCircleIcon,
      text: '生成我的卡片',
      type: 'poster'
    }]

    return (
      <View className='report'>
        {inviterOpenid && (
          <View className='assessment'>
            <View className='assessment-title'>
              {assessment.title}
            </View>
            <View className='inviter'>
              <Image className='avatar' src={inviter.headimgurl} />
              <View className='name'>
                {inviter.nickname}
              </View>
              分享
            </View>

            <View className='advertisement'>
              我刚刚完成了这个测试，这是我的测试结果，你要不要也来测一测？
            </View>

            <View
              className='assessment-btn'
              onClick={this.handleAssessment}
            >
              我也要测一测
            </View>
          </View>
        )}

        {is_comparable && (
          <View className='comparison-wrap'>
            <View className='comparison-info'>
              <View>
                距首次完成此评测已过去
              </View>
              <View className='time'>
                {first_test_at && formatTime(new Date() - new Date(first_test_at), 'D天h小时m分')}
              </View>
              <View>
                点击这里查看两次对比解读
              </View>
            </View>
            <View className='view-comparison-btn' onClick={this.viewComparison}>
              查看对比
            </View>
          </View>
        )}

        <View className='report-title'>
          {report?.title}
          <Image className='underline' src={underline} />
        </View>
        {/* <Image className='summary-img' src={report?.summary_image_url} mode='widthFix' /> */}

        <View className='content'>
          {/* <RichText className='rich-text' nodes={report?.content_html} /> */}
          {report?.summary_images?.map((img, i) => (
            <Image key={i} src={img} mode='widthFix' />
          ))}

        </View>

        <View
          className='more-btn'
          onClick={this.more}
        >
          去做更多测试
        </View>

        {is_sharable && (
          <ShareFixed options={shareOptions} showPoster={this.showPoster} />
        )}
        
        {showPoster && (
          <SharePoster poster={report.moment_share_image_url} inviter={wechatInfo} onHide={this.hidePoster} success={this.saveSuccess} />
        )}
        {showAlert && (
          <AlertModal title='保存成功' desc='已经保存到手机，到朋友圈炫一把' btnText='我知道了' handleClick={this.hideAlert} />
        )}
      </View>
    )
  }
}
