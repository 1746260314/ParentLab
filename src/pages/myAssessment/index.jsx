import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Progress } from '@tarojs/components'
import { getMyAssessments } from '../../utils/query'
import { formatTime } from '../../utils/util'
import Empty from '../../components/empty'
import './index.less'

export default class MyAssessment extends Component {

  state = {
    lists: []
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    this._getMyAssessments()
  }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  // 获取我的测评列表
  _getMyAssessments = async () => {
    const res = await getMyAssessments()
    if (res.status === 'success') {
      this.setState({ lists: res.data })
    }
  }

  // 继续
  handleContinue = ({ is_sub_assessment, assessment }) => {
    Taro.navigateTo({
      url: `/pages/${is_sub_assessment ? 'assessmentV2' : 'assessment'}/index?assessmentID=${assessment.id}`
    })
  }

  // 查看报告
  viewReport = ({ id, is_sub_assessment }) => {
    Taro.navigateTo({
      url: `/pages/${is_sub_assessment ? 'reportV2' : 'report'}/index?relationsID=${id}`
    })
  }

  // 打开H5报告
  toReportH5 = (code) => {
    const url = `/pages/reportH5/index?code=${code}`
    Taro.navigateTo({ url })
  }

  render() {
    const { lists } = this.state

    return (
      <View className='my-assessment'>

        {lists.map(item => (
          <View
            key={item.id}
            className='assessment-card'
          >
            <View className='content'>
              <View className='title'>
                {item.assessment.title}
              </View>
              <View className='state-bar'>
                <View className='time'>
                  {item.created_at && formatTime(new Date(item.created_at).getTime(), 'Y/M/D')}
                </View>
                {item.state === 'in_progress' ? (
                  <View
                    className='btn-full'
                    onClick={() => this.handleContinue(item)}
                  >
                    继续
                  </View>
                ) : (
                  <View
                    className='btn-line'
                    onClick={() => this.viewReport(item)}
                  >
                    查看报告
                  </View>
                )}
              </View>
            </View>
            {item.state === 'in_progress' && (
              <Progress percent={item.progress / item.assessment.question_count * 100} strokeWidth={4} active activeColor='#FF8863' backgroundColor='#ECF1F2' activeMode='forwards' />
            )}
            {item.h5_page_code && (
              <View className='report-wrap'>
                <View>
                  <View className='title'>
                    养育评估报告
                  </View>
                  <View className='desc'>
                    您的评估报告已生成，点击查看完整内容
                  </View>
                </View>
                <View
                  className='btn'
                  onClick={() => this.toReportH5(item.h5_page_code)}
                >
                  立即查看
                </View>
              </View>
            )}
          </View>
        ))}
        {lists.length === 0 && (
          <Empty />
        )}
      </View>
    )
  }
}
