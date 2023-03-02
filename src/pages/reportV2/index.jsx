import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getReportInfo, getAssessmentsShareInfo, getAssessmentUserRelationsShareInfo } from '../../utils/query'
import ShareDrawer from '../../components/shareDrawer'
import SharePosterV2 from '../../components/sharePosterV2'
import AlertModal from '../../components/alertModal'
import wxIcon from '../../images/wx_icon.png'
import sharePosterIcon from '../../images/share_poster.png'
import './index.less'

const app = getApp()
export default class Report extends Component {

  state = {
    relationsID: Taro.getCurrentInstance().router.params.relationsID,
    assessment: {},
    report: {},
    showPoster: false,
    showAlert: false,
    inviter: {},
    assessmentShareData: {},
    asessmentUserRelationsShare: {},
    show: false,
  }

  componentWillMount() { }

  componentDidMount() {
    this._getReportInfo()
    this._getAssessmentUserRelationsShareInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      const { type } = res.target.dataset
      const { assessmentShareData: { mp_share_title, mp_share_image_url }, assessment } = this.state
      if (type === 'assessment') {
        app.td_app_sdk.event({ id: '主报告分享-主报告分2' });
        return {
          title: mp_share_title,
          path: `/pages/assessmentDetailV2/index?assessmentID=${assessment.id}`,
          imageUrl: mp_share_image_url
        }
      }
    }
    app.td_app_sdk.event({ id: '主报告分享-主报告分1' });
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
      const { assessment, report } = res.data
      this.setState({
        report,
        assessment,
      })
      if (this.state.inviterOpenid) {
        Taro.setNavigationBarTitle({
          title: assessment.title
        })
      }
      this._getAssessmentsShareInfo(assessment.id)
    }
  }

  // 获取某测评的分享信息
  _getAssessmentsShareInfo = async (assessmentID) => {
    const res = await getAssessmentsShareInfo(assessmentID)
    if (res.status === 'success') {
      this.setState({ assessmentShareData: res.data })
    }
  }

    // 获取某测评报告的分享信息
    _getAssessmentUserRelationsShareInfo = async () => {
      const res = await getAssessmentUserRelationsShareInfo(this.state.relationsID)
      if (res.status === 'success') {
        this.setState({ asessmentUserRelationsShare: res.data })
      }
    }

  handleShowDrawer = () => {
    app.td_app_sdk.event({ id: '主报告分享-点击底部分享按钮' });
    this.setState({ show: true })
  }

  onHide = () => {
    this.setState({ show: false })
  }

  // 显示海报弹窗
  showPoster = () => {
    app.td_app_sdk.event({ id: '主报告分享-主报告分3' });
    this.onHide()
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

  handleAssessment = () => {
    const { assessment } = this.state
    Taro.redirectTo({ url: `/pages/assessmentDetail/index?assessmentID=${assessment.id}` })
  }

  more = () => {
    app.td_app_sdk.event({ id: '报告-返回按钮' });
    Taro.redirectTo({ url: '/pages/assessmentCenter/index' })
  }

  toReportInsights = () => {
    app.td_app_sdk.event({ id: '点击查看详情报告-点击底部查看详情报告' });
    Taro.navigateTo({ url: `/pages/reportInsights/index?relationsID=${this.state.relationsID}` })
  }

  render() {
    const { report, inviterOpenid, assessment, inviter, showPoster, asessmentUserRelationsShare, showAlert, show } = this.state
    const shareOptions = [{
      icon: wxIcon,
      text: '邀请好友测一测',
      type: 'assessment'
    }, {
      icon: sharePosterIcon,
      text: '生成报告卡片',
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

        <Image className='summary-img' src={report?.summary_image_url} mode='widthFix' />

        <View className='btn-wrap'>
          <View className='btn-line' onClick={this.handleShowDrawer}>
            邀请Ta一起测试
          </View>

          <View className='btn-full' onClick={this.toReportInsights}>
            查看详细解读
          </View>
        </View>

        <ShareDrawer show={show} options={shareOptions} showPoster={this.showPoster} onHide={this.onHide} />

        {showPoster && (
          <SharePosterV2 data={asessmentUserRelationsShare} success={this.savePosterSuccess} onHide={this.hidePoster} />
        )}

        {showAlert && (
          <AlertModal title='保存成功' desc='已经保存到手机，到朋友圈炫一把' btnText='我知道了' handleClick={this.hideAlert} />
        )}
      </View>
    )
  }
}
