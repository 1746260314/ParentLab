import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, Canvas } from '@tarojs/components'
import { getAssessmentsShareInfo, getAssessmentUserRelationsCompare } from '../../utils/query'
import { formatTime } from '../../utils/util'
import Charts from '../../utils/wxcharts-min.js'
import clockIcon from '../../images/clock.png'
import trelloIcon from '../../images/trello.png'
import vsIcon from '../../images/vs.png'
import scoreUpIcon from '../../images/score_up.png'
import scoreHoldIcon from '../../images/score_hold.png'
import scoreDownIcon from '../../images/score_down.png'
import './index.less'

const app = getApp()
export default class Comparison extends Component {

  state = {
    relationsID: Taro.getCurrentInstance().router.params.relationsID,
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    assessmentShareData: {},
    compareInfo: {}
  }

  componentWillMount() { }

  componentDidMount() {
    this._getAssessmentsShareInfo()
    this._getAssessmentUserRelationsCompare()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage(res) {
    console.log(res)
    const { assessmentShareData: { mp_share_title, mp_share_image_url }, assessmentID } = this.state
    return {
      title: mp_share_title,
      path: `/pages/assessmentDetailV2/index?assessmentID=${assessmentID}`,
      imageUrl: mp_share_image_url
    }
  }

  // 获取某测评的分享信息
  _getAssessmentsShareInfo = async () => {
    const res = await getAssessmentsShareInfo(this.state.assessmentID)
    if (res.status === 'success') {
      this.setState({ assessmentShareData: res.data })
    }
  }

  // 获取对比详情
  _getAssessmentUserRelationsCompare = async () => {
    const res = await getAssessmentUserRelationsCompare(this.state.relationsID)
    if (res.status === 'success') {
      this.setState({ compareInfo: res.data })
      this.initCharts(res.data)
    }
  }

  // 初始化ECharts
  initCharts = ({ comparisions = [] }) => {
    let windowWidth = 370;
    try {
      let res = Taro.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) { }

    let categories = []
    let firstScore = []
    let currentScore = []
    for (let i = 0; i < comparisions.length; i++) {
      const item = comparisions[i];
      categories.push(item.sub_assessment_title)
      firstScore.push(item.first_score)
      currentScore.push(item.current_score)
    }

    new Charts({
      canvasId: 'canvas2',
      dataPointShape: false,
      type: 'column',
      categories: categories,
      series: [{
        name: '首次',
        data: firstScore,
        color: "rgba(0,0,0,0.3)"//支持rgba，但不支持渐变色     
      }, {
        name: '最近',
        data: currentScore
      }],
      yAxis: {
        format: function (val) {
          return val + '分';
        }
      },
      xAxis: {
        disableGrid: true,
      },
      width: windowWidth - 64,
      height: 240,
      dataLabel: true,
    });
  }

  goBack = () => {
    Taro.redirectTo({ url: `/pages/reportInsights/index?relationsID=${this.state.relationsID}` })
  }

  getAngleIcon = (type) => {
    let icon = null
    switch (type) {
      case '上升':
        icon = scoreUpIcon;
        break;
      case '持平':
        icon = scoreHoldIcon;
        break;
      case '下降':
        icon = scoreDownIcon;
        break;
      default:
        null
    }
    return icon
  }
 
  renderTitle = ({sub_assessment_title, compare_rate, first_score, current_score}) => {
    let title = `【${sub_assessment_title}】`
    switch (compare_rate) {
      case '上升':
        title = `${title}上升${current_score - first_score}分`;
        break;
      case '持平':
        title = `${title}持平`;
        break;
      case '下降':
        title = `${title}下降${first_score - current_score}分`;
        break;
      default:
        null
    }
    return title
  }

  render() {
    const { compareInfo: { assessment_title, first_test_at, current_test_at, comparisions = [] } } = this.state

    return (
      <View className='comparison'>
        <View className='tips'>
          您分别在以下时间进行了
        </View>
        <View className='assessment-title'>
          {assessment_title}
        </View>
        <View className='time-wrap'>
          <View className='time'>
            <Image className='icon' src={clockIcon} />
            <Text>
              上次：
              {first_test_at && formatTime(new Date(first_test_at), 'Y年M月D日 h时m分s秒')}
            </Text>
          </View>
          <View className='time'>
            <Image className='icon' src={clockIcon} />
            <Text>
              最近：
              {current_test_at && formatTime(new Date(current_test_at), 'Y年M月D日 h时m分s秒')}
            </Text>
          </View>
        </View>

        <View className='label'>
          <Image className='icon' src={trelloIcon} />
          <Text>整体对比</Text>
        </View>

        <View className='bar-chart-wrap'>
          <Canvas canvasId='canvas2' className='column'></Canvas>
        </View>

        {comparisions.map(item => (
          <View className='content' key={item.sub_assessment_id}>
            <View className='conclusion'>
             {this.renderTitle(item)}
            </View>
            <View className='score-bar'>
              <Image
                className='angle'
                src={this.getAngleIcon(item.compare_rate)}
              />
              <View className='old-score-block'>
                <View className='score'>
                  <Text className='num'>{item.first_score}</Text>
                  <Text className='unit'>分</Text>
                </View>
                <View className='score-label'>
                  首次测评
                </View>
              </View>
              <Image className='vsIcon' src={vsIcon} />
              <View className='new-score-block'>
                <View className='score'>
                  <Text className='num'>{item.current_score}</Text>
                  <Text className='unit'>分</Text>
                </View>
                <View className='score-label'>
                  最新测评
                </View>
              </View>
            </View>

            <View className='comment'>
              {item.compare_text &&
                item.compare_text
                  .split('\n')
                  .map((text, index) => <View key={index}>{text}</View>)
              }
            </View>

          </View>
        ))}

        <View
          className='back-btn'
          onClick={this.goBack}
        >
          查看详情报告
        </View>
      </View>
    )
  }
}
