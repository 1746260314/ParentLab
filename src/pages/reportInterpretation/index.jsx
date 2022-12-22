import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getReportInfo, getUserProfile, getUserPublicInfo } from '../../utils/query'
import ShareDrawer from '../../components/shareDrawer'
import ShareFixed from '../../components/shareFixed'
import SharePoster from '../../components/sharePoster'
import AlertModal from '../../components/alertModal'
import underline from '../../images/underline2.png'
import wxIcon from '../../images/wx_icon.png'
import shareReportIcon from '../../images/share_icon_report.png'
import shareCircleIcon from '../../images/share_icon_circle.png'
import arrowRight from '../../images/arrow_right_32.png'
import pageview from '../../images/pageview.png'
import modalTitleBg from '../../images/modal_title_bg.png'
import close from '../../images/close.png'

import './index.less'

const app = getApp()
export default class ReportInterpretation extends Component {

  state = {
    relationsID: Taro.getCurrentInstance().router.params.relationsID || 107,
    assessment: {},
    report: {},
    showPoster: false,
    showAlert: false,
    wechatInfo: {},
    showDrawer: false,
    showModal: false,
    needDetainment: true,
    showDetainment: false,
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

  // 显示挽留弹窗
  showDetainmentModal = () => {
    this.setState({ showDetainment: true })
  }
  onHideDetainmentModal = () => {
    this.setState({ showDetainment: false })
  }

  // 点击邀请好友测一测
  handleInvite = () => {
    this.onHideDetainmentModal()
    this.handleShowShareDrawer()
    this.setState({needDetainment: false})
  }

  toFeedback = () => {
    this.onHideDetainmentModal()
    Taro.navigateTo({url: '/pages/feedback/index'})
  }

  // 返回测试首页
  goAssessmentLists = () => {
    app.td_app_sdk.event({ id: '报告-返回按钮' });
    if (this.state.needDetainment) {
      this.showDetainmentModal()
    } else {
      Taro.redirectTo({ url: '/pages/assessmentCenter/index' })
    }
  }

  handleShowShareDrawer = () => {
    this.setState({ showDrawer: true })
  }

  onHideShareDrawer = () => {
    this.setState({ showDrawer: false })
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

  // 打开更多深度解读modal
  showModal = () => {
    this.setState({ showModal: true })
  }

  // 关闭更多深度解读modal
  handleCloseModal = () => {
    this.setState({ showModal: false })
  }

  render() {
    const { report, assessment, showPoster, wechatInfo, showAlert, showDrawer, showModal, showDetainment } = this.state
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
      <View className='report-interpretation'>
        <View className='container'>

          <View className='assessment-title'>
            您的《{assessment?.title}》结果是
          </View>

          <View className='report-title'>
            {report?.title}
            <Image className='underline' src={underline} />
          </View>

          <View className='result-bar'>
            大约有
            <View className='result'>
              15%
            </View>
            的测试用户和您的结果一致
          </View>

          {/* <View className='content'>
            {report?.summary_images?.map((img, i) => (
              <Image key={i} src={img} mode='widthFix' />
            ))}
          </View> */}
        </View>

        <View className='other-title' >
          更多深度解读
        </View>

        <View
          className='other-item'
          onClick={this.showModal}
        >
          什么是自卑感？
          <Image className='icon' src={arrowRight} mode='widthFix' />
        </View>

        <View className='other-item' >
          什么是自卑感？
          <Image className='icon' src={arrowRight} mode='widthFix' />
        </View>

        <View className='other-item' >
          什么是自卑感？
          <Image className='icon' src={arrowRight} />
        </View>

        <View className='other-title' >
          测试推荐
        </View>

        <View className='recommend-wrap' >
          <View className='recommend-card' >
            <View className='tag' >
              自我诊断
            </View>
            <View className='title' >
              测一测你有多依赖你的另一半
            </View>
            <View className='desc' >
              这是一个评测简介说明，最多3行。这是一个评测简介说明，最多3行。这是一个评测简介说明，最多3行。这是一个评测简介说明，最多3行。
            </View>
            <View className='btn-bar' >
              <View className='data-block' >
                <Image className='icon' src={pageview} />
                1187人已测过
              </View>
              <View className='btn' >
                开始测试
              </View>
            </View>
          </View>

          <View className='recommend-card'></View>
          <View className='recommend-card'></View>
        </View>

        <View
          className='more-btn'
          onClick={this.goAssessmentLists}
        >
          返回测试首页
        </View>

        {showModal && (
          <View className='modal-mask'>
            <View className='modal'>
              <Image
                className='close'
                src={close}
                onClick={this.handleCloseModal}
              />
              <View className='title'>
                什么是自卑感
              </View>
              <View className=''>

              </View>
            </View>
          </View>
        )}

        <ShareDrawer show={showDrawer} options={shareOptions} showPoster={this.showPoster} onHide={this.onHideShareDrawer} />

        <ShareFixed options={shareOptions} showPoster={this.showPoster} />

        {showPoster && (
          <SharePoster poster={report.moment_share_image_url} inviter={wechatInfo} onHide={this.hidePoster} success={this.saveSuccess} />
        )}

        {showAlert && (
          <AlertModal title='保存成功' desc='已经保存到手机，到朋友圈炫一把' btnText='我知道了' handleClick={this.hideAlert} />
        )}

        {showDetainment && (
          <View className='detainment-modal'>
            <View className='detainment-content'>
              <Image className='title-bg' src={modalTitleBg} />
              <Image className='close' src={close} onClick={this.onHideDetainmentModal} />
              <View className='title'>
                好厉害
              </View>
              <View className='desc'>
                您读完了报告的详细解读，如果您觉得
              </View>
              <View className='label'>
                这个测评还不错
              </View>
              <View
                className='btn-full'
                onClick={this.handleInvite}
              >
                邀请好友测一测
              </View>
              <View className='label'>
                我有意见要说
              </View>
              <View
                className='btn-line'
                onClick={this.toFeedback}
              >
                吐槽我们
              </View>
            </View>
          </View>
        )}

      </View>
    )
  }
}
