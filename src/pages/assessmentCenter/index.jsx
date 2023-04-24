import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getAssessmentCategories, getAssessmentsForCategoriesID, getLatestAssessments, getPopularAssessments } from '../../utils/query'
import NavigatorFixed from '../../components/navigatorFixed'
import pageviewIcon from '../../images/pageview.png'
import closeIcon from '../../images/fork.png'
import hotIcon from '../../images/hot.png'
import hotAngle from '../../images/hot_angle.png'
import newIcon from '../../images/new.png'
import newAngle from '../../images/new_angle.png'

import './index.less'

const app = getApp()
export default class AssessmentCenter extends Component {

  state = {
    tabs: [],
    ategoryId: '',
    selects: [],
    selectAll: true,
    assessmentsDatasource: [],
    assessments: [],
    newAssessments: [],
    hotAssessments: [],
    isFixed: false,
    currentScrollTop: '',
  }

  componentWillMount() { }

  componentDidMount() {
    this._getAssessmentCategories()
    this._getAssessmentsForCategoriesID()
    this._getLatestAssessments()
    this._getPopularAssessments()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onPageScroll = (e) => {
    let _this = this
    let scrollTop = parseInt(e.scrollTop)
    const { currentScrollTop, isFixed } = this.state
    const query = Taro.createSelectorQuery()
    query.select('#tags_bar').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      const top = res[0].top
      if (top <= 30 && !isFixed) {
        _this.setState({
          isFixed: true,
          currentScrollTop: scrollTop
        })
      }
      if (scrollTop < currentScrollTop && isFixed) {
        _this.setState({ isFixed: false })
      }
    })
  }

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
      const tabs = res.data
      const selects = this.state.selectAll ? tabs.map(item => item.id) : []
      this.setState({
        tabs,
        selects
      })
    }
  }

  // 查询列表
  _getAssessmentsForCategoriesID = async () => {
    const res = await getAssessmentsForCategoriesID(this.state.ategoryId)
    if (res.status === 'success') {
      this.setState({
        assessments: res.data,
        assessmentsDatasource: res.data
      })
    }
  }

  // 获取最新测试
  _getLatestAssessments = async () => {
    const res = await getLatestAssessments()
    if (res.status === 'success') {
      this.setState({ newAssessments: res.data })
    }
  }

  // 获取最热测试
  _getPopularAssessments = async () => {
    const res = await getPopularAssessments()
    if (res.status === 'success') {
      this.setState({ hotAssessments: res.data })
    }
  }

  handleChangeAll = () => {
    const { selectAll, tabs, assessmentsDatasource } = this.state
    const selects = selectAll ? [] : tabs.map(item => item.id)
    const assessments = selectAll ? [] : assessmentsDatasource
    this.setState({
      selects,
      assessments,
      selectAll: !selectAll
    })
  }

  // 切换标签
  handleChangeTab = (id) => {
    const { tabs, selects, assessmentsDatasource } = this.state
    app.td_app_sdk.event({ id: '测评页面-切换tab' });
    const index = selects.findIndex(item => item === id)
    let arr = []
    if (index === -1) {
      arr = [...selects, id]
    } else {
      arr = selects.filter(item => item !== id)
    }
    const assessments = assessmentsDatasource.filter(item => arr.find(selectID => item?.assessment_category?.id === selectID))
    this.setState({
      selects: arr,
      assessments,
      selectAll: arr.length === tabs.length
    })
  }

  // 前往详情页
  toDetail = (assessment) => {
    const { id, is_sub_assessment } = assessment
    app.td_app_sdk.event({ id: '测评页面-开始测评' });
    Taro.navigateTo({
      url: `/pages/${is_sub_assessment ? 'assessmentDetailV2' : 'assessmentDetail'}/index?assessmentID=${id}`
    })
  }

  render() {
    const { tabs, assessments, selects, newAssessments, hotAssessments, selectAll, isFixed } = this.state
    return (
      <View className='assessment-center'>
        <View className='label-bar'>
          <Image className='icon' src={newIcon} />
          最新测试
        </View>
        {newAssessments.map(newAssessment => (
          <View
            className='assessment-item'
            key={newAssessment.id}
            onClick={() => this.toDetail(newAssessment)}
          >
            <Image className='assessment-banner' src={newAssessment.banner_image_url} mode='aspectFill' />
 
            <View className='tab-wrap'>
              {newAssessment.tags.map(tag => (
                <View
                  key={tag}
                  className='tag'
                >
                  {tag}
                </View>
              ))}
            </View>

            <View className='assessment-card'>
              <Image className='angle-icon' src={newAngle} />
              <View className='title'>
                {newAssessment.title}
              </View>
              <View className='desc'>
                {newAssessment.short_desc}
              </View>

              <View className='btn-bar'>
                <View className='pageview'>
                  <Image className='icon' src={pageviewIcon} />
                  {newAssessment.take_counts}人已测过
                </View>
                <View className='btn'>
                  开始测试
                </View>
              </View>
            </View>
          </View>
        ))}

        <View className='label-bar' style={{ marginTop: '40px' }}>
          <Image className='icon' src={hotIcon} />
          热门测试
        </View>
        <View className='recommend-wrap' >
          {hotAssessments.map(hotAssessment => (
            <View
              className='recommend-card'
              key={hotAssessment.id}
              onClick={() => this.toDetail(hotAssessment)}
            >
              <Image className='angle-icon' src={hotAngle} />
              <View className='tags'>
                {hotAssessment.tags.map((tag, index) => (
                  <View className='tag' key={index}>
                    {tag}
                  </View>
                ))}
              </View>
              <View className='title' >
                {hotAssessment.title}
              </View>
              <View className='desc' >
                {hotAssessment.short_desc}
              </View>
              <View className='btn-bar' >
                <View className='data-block' >
                  <Image className='icon' src={pageviewIcon} />
                  {hotAssessment.take_counts}人已测过
                </View>
                <View className='btn'>
                  开始测试
                </View>
              </View>
            </View>
          ))}
        </View>

        <View className='label-bar'>
          所有测试
        </View>
        <View className={isFixed ? 'tabs-bar fixed' : 'tabs-bar'} id='tags_bar'>
          <View
            className={`tab ${selectAll ? 'active' : ''}`}
            onClick={this.handleChangeAll}
          >
            {selectAll && (
              <Image className='close' src={closeIcon} />
            )}
            全部
          </View>

          {tabs.map(tab => (
            <View
              className={`tab ${selects.find(item => item === tab.id) ? 'active' : ''}`}
              key={tab.id}
              onClick={() => this.handleChangeTab(tab.id)}
            >
              {selects.find(item => item === tab.id) && (
                <Image className='close' src={closeIcon} />
              )}
              {tab.title}
            </View>
          ))}
        </View>

        {assessments.map(assessment => (
          <View
            className='assessment-item'
            key={assessment.id}
            onClick={() => this.toDetail(assessment)}
          >
            <Image className='assessment-banner' src={assessment.banner_image_url} mode='aspectFill' />
            <View className='tab-wrap'>
              {assessment.tags.map(tag => (
                <View
                  key={tag}
                  className='tag'
                >
                  {tag}
                </View>
              ))}
            </View>
            <View className='assessment-card'>
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
          </View>
        ))}
        <NavigatorFixed selected={3} />
      </View>
    )
  }
}
