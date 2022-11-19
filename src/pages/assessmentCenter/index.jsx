import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getAssessmentCategories, getAssessmentsForCategoriesID } from '../../utils/query'
import NavigatorFixed from '../../components/navigatorFixed'
import pageviewIcon from '../../images/pageview.png'
import './index.less'

const app = getApp()
export default class AssessmentCenter extends Component {

  state = {
    tabs: [],
    ategoryId: '',
    assessments: [],
  }

  componentWillMount() { }

  componentDidMount() {
    this._getAssessmentCategories()
    this._getAssessmentsForCategoriesID()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage() {
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  // 获取分类
  _getAssessmentCategories = async () => {
    const res = await getAssessmentCategories()
    if (res.status === 'success') {
      this.setState({ tabs: [{ id: '', title: '全部' }, ...res.data] })
    }
  }

  // 查询列表
  _getAssessmentsForCategoriesID = async () => {
    const params = { assessment_category_id_eq: this.state.ategoryId }
    const res = await getAssessmentsForCategoriesID(this.state.ategoryId)
    if (res.status === 'success') {
      this.setState({ assessments: res.data })
    }
  }

  // 切换标签
  handleChangeTab = (id) => {
    const { ategoryId } = this.state
    if (id === ategoryId) return
    app.td_app_sdk.event({ id: '测评页面-切换tab' });
    this.setState(
      { ategoryId: id },
      () => this._getAssessmentsForCategoriesID()
    )
  }

  // 前往详情页
  toDetail = (assessmentID) => {
    app.td_app_sdk.event({ id: '测评页面-开始测评' });
    Taro.navigateTo({
      url: `/pages/assessmentDetail/index?assessmentID=${assessmentID}`
    })
  }


  render() {
    const { tabs, ategoryId, assessments } = this.state
    return (
      <View className='assessment-center'>
        <NavigatorFixed selected={2} />
        <View className='tabs-bar'>
          {tabs.map(tab => (
            <View
              className={`tab ${tab.id === ategoryId ? 'active' : ''}`}
              key={tab.id}
              onClick={() => this.handleChangeTab(tab.id)}
            >
              {tab.title}
            </View>
          ))}
        </View>


        {assessments.map(assessment => (
          <View
            className='assessment-card'
            key={assessment.id}
            onClick={() => this.toDetail(assessment.id)}
          >
            {assessment.tags.map(tag => (
              <View
                key={tag}
                className='tag'
              >
                {tag}
              </View>
            ))}

            <View className='title'>
              {assessment.title}
            </View>
            <View className='desc'>
              {assessment.short_desc}
            </View>

            <View className='btn-bar'>
              <View className='pageview'>
                <Image className='icon' src={pageviewIcon} />
                {assessment.take_counts}人已测过
              </View>
              <View className='btn'>
                开始测试
              </View>
            </View>

          </View>
        ))}
      </View>
    )
  }
}
