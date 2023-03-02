import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button, CoverView, RichText } from '@tarojs/components'
import { getReportInfo, getMoreInsights, getMoreAssessments, getRecommendedEvent, getAssessmentsShareInfo, getAssessmentUserRelationsShareInfo } from '../../utils/query'
import ShareFixed from '../../components/shareFixed'
import PieChart from '../../components/pieChart'
import SharePosterV2 from '../../components/sharePosterV2'
import AlertModal from '../../components/alertModal'
import underline from '../../images/underline2.png'
import wxIcon from '../../images/wx_icon.png'
import sharePosterIcon from '../../images/share_poster.png'
import arrowRight from '../../images/arrow_right_32.png'
import pageview from '../../images/pageview.png'
import close from '../../images/close.png'

import './index.less'

const app = getApp()
export default class ReportInsights extends Component {

  state = {
    relationsID: Taro.getCurrentInstance().router.params.relationsID,
    assessment: {},
    moreInsights: [],
    sub_reports: [],
    showModal: false,
    insightModalContent: '',
    moreAssessments: [],
    recommendedEvents: [],
    needShare: true,
    showOtherInsightModal: false,
    otherInsightID: '',
    assessmentShareData: {},
    asessmentUserRelationsShare: {},
    showPoster: false,
    showAlert: false,
  }

  componentWillMount() { }

  componentDidMount() {
    this._getAssessmentUserRelationsShareInfo()
    this._getReportInfo()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      const { type } = res.target.dataset
      const { assessment, assessmentShareData } = this.state
      if (type === 'assessment') {
        app.td_app_sdk.event({ id: '详细报告分享-详细报告分2' });
        return {
          title: assessmentShareData.mp_share_title,
          path: `/pages/assessmentDetailV2/index?assessmentID=${assessment.id}`,
          imageUrl: assessmentShareData.mp_share_image_url
        }
      }
    }
    app.td_app_sdk.event({ id: '详细报告分享-详细报告分1' });
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
      const { assessment, sub_reports = [], assessment_id } = res.data
      this.setState({
        assessment,
        sub_reports,
      })
      this._getMoreInsights(assessment_id)
      this._getMoreAssessments(assessment_id)
      this._getRecommendedEvent(assessment_id)
      this._getAssessmentsShareInfo(assessment_id)
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

  // 获取推荐的服务
  _getRecommendedEvent = async (assessmentID) => {
    const res = await getRecommendedEvent(assessmentID)
    if (res.status === 'success') {
      this.setState({ recommendedEvents: res.data || [] })
    }
  }

  // 获取更多深度解读
  _getMoreInsights = async (assessmentID) => {
    const res = await getMoreInsights(assessmentID)
    if (res.status === 'success') {
      this.setState({ moreInsights: res.data || [] })
    }
  }

  // 获取更多测评推荐
  _getMoreAssessments = async (assessmentID) => {
    app.td_app_sdk.event({ id: '详情报告-推荐测试点击' });
    const res = await getMoreAssessments(assessmentID)
    if (res.status === 'success') {
      this.setState({ moreAssessments: res.data || [] })
    }
  }

  // 去服务详情
  toEventDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  // 返回评测首页
  goAssessmentLists = () => {
    Taro.redirectTo({ url: '/pages/assessmentCenter/index' })
  }

  // 打开更多深度解读modal
  showModal = (insight) => {
    this.setState({
      showModal: true,
      insightModalContent: insight
    })
  }

  // 关闭更多深度解读modal
  handleCloseModal = () => {
    this.setState({ showModal: false })
  }

  // 点击开始测试
  startAssessment = (assessment) => {
    Taro.navigateTo({
      url: `/pages/${assessment.is_sub_assessment ? 'assessmentDetailV2' : 'assessmentDetail'}/index?assessmentID=${assessment.id}`
    })
  }

  // 处理饼图数据
  transitionData = (data) => {
    return data.map(item => ({ name: item.sub_assessment_report_title, data: item.count, id: item.sub_assessment_report_id }))
  }

  // 点击饼图 
  clickPie = (data) => {
    app.td_app_sdk.event({ id: '点击详细报告图标-详细报告图标点击' });
    const { needShare } = this.state
    this.setState({ otherInsightID: data.id })
    if (needShare) {
      this.showOrHideOtherInsightModal()
    } else {
      Taro.navigateTo({ url: `/pages/otherInsights/index?insightID=${data.id}&insightID=${this.state.relationsID}` })
    }
  }

  // 打开或关闭查看其他报告解读
  showOrHideOtherInsightModal = () => {
    this.setState({ showOtherInsightModal: !this.state.showOtherInsightModal })
  }

  // 点击分享解锁其他报告
  unlock = () => {
    app.td_app_sdk.event({ id: '点击详细报告图标-图标分享' });
    this.showOrHideOtherInsightModal()
    this.setState({ needShare: false })
    Taro.navigateTo({ url: `/pages/otherInsights/index?insightID=${this.state.otherInsightID}` })
  }

  // 显示海报弹窗
  showPoster = () => {
    app.td_app_sdk.event({ id: '详细报告分享-详细报告分3' });
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

  render() {
    const { assessment, sub_reports, showModal, moreInsights, insightModalContent, moreAssessments, recommendedEvents, showOtherInsightModal, showPoster, showAlert, asessmentUserRelationsShare } = this.state
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
      <View className='report-insights'>
        <View className='container'>
          <View className='assessment-title'>
            您的《{assessment?.title}》结果是
          </View>

          {sub_reports.map((sub, index) => (
            <View key={index}>
              <View className='report-title'>
                {sub.title}
                <Image className='underline' src={underline} />
              </View>

              {sub.show_chart && (
                <View className='pie-chart-wrap'>
                  {!showPoster && !showAlert && (
                    <PieChart
                      id={index}
                      data={this.transitionData(sub.chart_data)}
                      onClick={this.clickPie}
                    />
                  )}
                </View>
              )}

              {sub.show_chart && (
                <View className='result-bar'>
                  大约有
                  <View className='result'>
                    {sub.similararies}%
                  </View>
                  的测试用户和您的结果一致
                </View>
              )}
              <View className='content-wrap'>
                {sub.items?.map((item, i) => (
                  <View className='content-item' key={i}>
                    <View className='title'>
                      {item.title}
                    </View>
                    <View className='content'>
                      <RichText nodes={item.content_html} />
                    </View>
                  </View>
                ))}
              </View>

            </View>
          ))}

          <View className='content-item' style={{ display: recommendedEvents.length > 0 ? 'block' : 'none' }}>
            <View className='title'>
              更多养育支持服务
            </View>

            {recommendedEvents.map(event => (
              <View
                key={event.id}
                className='event-card'
                onClick={() => this.toEventDetail(event.id)}
              >
                <View className='head-image' style={{ backgroundImage: `url(${event.banner_image_url})` }} >
                  {event.tags?.map(tag => (
                    <View className='tag' key={tag} >
                      {tag}
                    </View>
                  ))}
                </View>
                <View className='event-content' >
                  <View className='title' >
                    {event.title}
                  </View>
                  <View className='time' >
                    {event.time_desc}
                  </View>
                  <View className='desc' >
                    {event.brief_introduction}
                  </View>
                </View>
              </View>
            ))}
          </View>

        </View>

        <View className='content-item' style={{ display: moreInsights.length > 0 ? 'block' : 'none' }}>
          <View className='title'>
            更多深度解读
          </View>

          {moreInsights.map((insight, index) => (
            <View
              key={index}
              className='other-item'
              onClick={() => this.showModal(insight)}
            >
              {insight.title}
              <Image className='icon' src={arrowRight} />
            </View>
          ))}
        </View>

        <View className='content-item' style={{ display: moreAssessments.length > 0 ? 'block' : 'none' }}>
          <View className='title' >
            测试推荐
          </View>
          <View className='recommend-wrap' >
            {moreAssessments.map(moreAssessment => (
              <View
                className='recommend-card'
                key={moreAssessment.id}
              >
                <View className='tags'>
                  {moreAssessment.tags.map((tag, index) => (
                    <View className='tag' key={index}>
                      {tag}
                    </View>
                  ))}
                </View>

                <View className='title' >
                  {moreAssessment.title}
                </View>
                <View className='desc' >
                  {moreAssessment.short_desc}
                </View>
                <View className='btn-bar' >
                  <View className='data-block' >
                    <Image className='icon' src={pageview} />
                    {moreAssessment.take_counts}人已测过
                  </View>
                  <View
                    className='btn'
                    onClick={() => this.startAssessment(moreAssessment)}
                  >
                    开始测试
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          className='more-btn'
          onClick={this.goAssessmentLists}
        >
          返回评测首页
        </View>

        <ShareFixed options={shareOptions} showPoster={this.showPoster} />

        {/* 更多深度解读详情弹窗 */}
        {showModal && (
          <View className='modal-mask'>
            <View className='modal'>
              <Image
                className='close'
                src={close}
                onClick={this.handleCloseModal}
              />
              <View className='title'>
                {insightModalContent.title}
              </View>
              <View className='insight-content'>
                <RichText nodes={insightModalContent.content_html} />
              </View>
            </View>
          </View>
        )}

        {showOtherInsightModal && (
          <CoverView className='other-insight-modal-mask'>
            <CoverView className='modal'>
              <CoverView className='title'>
                查看其他评测报告
              </CoverView>
              <CoverView className='desc'>
                分享到微信，即可查看更多报告
              </CoverView>
              <Button
                className='share-btn'
                onClick={this.unlock}
                openType='share'
              >
                <CoverView className='btn-wrap'>
                  <CoverView className='icon'>

                  </CoverView>
                  立即分享
                </CoverView>
              </Button>
            </CoverView>
          </CoverView>
        )}

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
