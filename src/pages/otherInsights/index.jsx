import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button, CoverView, CoverImage } from '@tarojs/components'
import { getOtherInsights } from '../../utils/query'
import ShareFixed from '../../components/shareFixed'
import PieChart from '../../components/pieChart'
import underline from '../../images/underline2.png'
import wxIcon from '../../images/wx_icon.png'
import modalTitleBg from '../../images/modal_title_bg.png'
import close from '../../images/close.png'

import './index.less'

export default class OtherInsights extends Component {

  state = {
    insightID: Taro.getCurrentInstance().router.params.insightID,
    insightData: {},
    needDetainment: true,
    showDetainment: false,
  }

  componentWillMount() { }

  componentDidMount() {
    this._getOtherInsights()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      const { insightData: { assessment } } = this.state
      return {
        title: assessment.title,
        path: `/pages/assessmentDetailV2/index?assessmentID=${assessment.id}`,
        imageUrl: assessment.wechat_share_image_url
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
  _getOtherInsights = async () => {
    const res = await getOtherInsights(this.state.insightID)
    if (res.status === 'success') {
      this.setState({ insightData: res.data })
    }
  }

  // 显示挽留弹窗
  showDetainmentModal = () => {
    this.setState({ showDetainment: true })
  }
  onHideDetainmentModal = () => {
    this.setState({ showDetainment: false })
  }

  // 关闭拦截
  closeDetainment = () => {
    this.setState({ needDetainment: false })
  }

  // 去分享
  toShare = () => {
    this.closeDetainment()
    this.onHideDetainmentModal()
  }

  // 去吐槽
  toFeedback = () => {
    this.onHideDetainmentModal()
    this.closeDetainment()
    Taro.navigateTo({ url: '/pages/feedback/index' })
  }

  // 返回评测首页
  goAssessmentLists = () => {
    if (this.state.needDetainment) {
      this.showDetainmentModal()
    } else {
      Taro.redirectTo({ url: '/pages/assessmentCenter/index' })
    }
  }

  // 处理饼图数据
  transitionData = (data) => {
    return data.map(item => ({ name: item.sub_assessment_report_title, data: item.count, id: item.sub_assessment_report_id }))
  }

  render() {
    const { insightData, showDetainment } = this.state
    const shareOptions = [{
      icon: wxIcon,
      text: '邀请好友测一测',
      type: 'assessment'
    }]

    return (
      <View className='report-insights'>
        <View className='container'>

          <View className='report-title'>
            {insightData.title}
            <Image className='underline' src={underline} />
          </View>
          {insightData.chart_data && (
            <PieChart
              id={1}
              data={this.transitionData(insightData.chart_data)}
            />
          )}

          {insightData.items?.map((item, i) => (
            <View className='content-item' key={i}>
              <View className='title'>
                {item.title}
              </View>
              <View className='content'>
                {item.plain_content}
              </View>
            </View>
          ))}

        </View>

        <View
          className='more-btn'
          onClick={this.goAssessmentLists}
        >
          返回评测首页
        </View>

        <ShareFixed options={shareOptions} />

        {showDetainment && (
          <CoverView className='detainment-modal'>
            <CoverView className='detainment-content'>
              <CoverView className='title-bg'>
                <CoverImage src={modalTitleBg} />
              </CoverView>
              <CoverView className='close' onClick={this.onHideDetainmentModal} >
                X
              </CoverView>

              <CoverView className='title'>
                好厉害
              </CoverView>
              <CoverView className='desc'>
                您读完了报告的详细解读，如果您觉得
              </CoverView>
              <CoverView className='label'>
                这个测评还不错
              </CoverView>
              <Button
                className='btn-full'
                openType='share'
                onClick={this.toShare}
              >
                <CoverView className='btn-wrap'>
                  邀请好友测一测
                </CoverView>
              </Button>
              <CoverView className='label'>
                我有意见要说
              </CoverView>
              <CoverView
                className='btn-line'
                onClick={this.toFeedback}
              >
                吐槽我们
              </CoverView>
            </CoverView>
          </CoverView>
        )}

      </View>
    )
  }
}
