import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image, Progress } from '@tarojs/components'
import { RadioBars2 } from '../../components/formElements'
import { getAssessmentQuestions, updateProgress, assessmentFinished } from '../../utils/query'
import prevDisabledIcon from '../../images/prev_disabled.png'
import prevIcon from '../../images/prev.png'
import nextDisabledIcon from '../../images/next_disabled.png'
import nextIcon from '../../images/next.png'
import wxIcon from '../../images/wx_icon.png'
import './index.less'

const app = getApp()
export default class Assessment extends Component {

  state = {
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    id: Taro.getCurrentInstance().router.params.id,
    questions: [],
    answer_snapshot: [],
    current: 0,
    progress: 0,
    assessment: {},
  }

  componentWillMount() { }

  componentDidMount() {
    const {id, assessmentID} = this.state
    const params = id ? {id} : {assessment_id: assessmentID}
    this._getAssessmentQuestions(params)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage(res) {
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   // console.log(res.target)
    //   app.td_app_sdk.event({ id: '答题-分享' });
    //   const { assessment, assessmentID } = this.state
    //   return {
    //     title: assessment.wechat_share_title,
    //     path: `/pages/assessmentDetailV2/index?assessmentID=${assessmentID}`,
    //     imageUrl: assessment.wechat_share_image_url
    //   }
    // }
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  // 获取测试题目
  _getAssessmentQuestions = async (params) => {
    const res = await getAssessmentQuestions(params)
    if (res.status === 'success') {
      const { questions, assessment_user_relation } = res.data
      const progress = assessment_user_relation.progress || 0
      const current = progress === questions.length ? progress - 1 : progress
      this.setState({
        questions,
        relationsID: assessment_user_relation.id,
        current,
        progress,
        answer_snapshot: assessment_user_relation.answer_snapshot || [],
        assessment: assessment_user_relation.assessment
      })
    }
  }

  // 单选题选择处理器
  handleRadioChange = (data) => {
    const { questions, answer_snapshot, current, progress } = this.state
    let answerSnapshot = [...answer_snapshot]
    answerSnapshot[current] = {
      question_id: questions[current].id,
      question_title: questions[current].title,
      answers: [{
        answer_id: data.id,
        answer_title: data.title,
        score: data.score
      }]
    }

    this.setState(
      {
        answer_snapshot: answerSnapshot,
        progress: current === progress ? progress + 1 : progress
      },
      () => this._updateProgress()
    )
  }

  // 更新进度
  _updateProgress = async () => {
    await Taro.showLoading({
      title: '',
      mask: true
    })
    const { relationsID, progress, answer_snapshot, current, questions } = this.state
    const params = {
      assessment_user_relation: {
        progress,
        answer_snapshot
      }
    }
    const res = await updateProgress(relationsID, params)
    if (res.status === 'success') {
      this.setState(
        { current: current === questions.length - 1 ? current : current + 1 },
        () => this.confirmCompletion()
      )
    }
    await Taro.hideLoading()
  }

  // 确认是否完成全部题目
  confirmCompletion = () => {
    const { current, progress, questions } = this.state
    if (current === questions.length - 1 && progress === questions.length) {
      this.showModal()
    } else {
      return
    }
  }

  showModal = () => {
    const _this = this
    Taro.showModal({
      showCancel: true,
      title: '您已答完全部问题',
      content: '是否立即查看报告',
      cancelText: '取消',
      confirmText: '查看报告',
      success: function (res) {
        if (res.confirm) {
          app.td_app_sdk.event({ id: '答题-pop1' });
          _this._assessmentFinished()
        } else if (res.cancel) {
          // console.log('用户点击取消')
          app.td_app_sdk.event({ id: '答题-pop2' });
        }
      }
    })
  }

  handlePrev = () => {
    const { current } = this.state
    const disabled = current === 0
    if (disabled) return
    this.setState({ current: current - 1 })
  }

  handleNext = () => {
    const { current, progress, questions } = this.state
    const disabled = current === progress
    if (disabled) return
    if (current === questions.length - 1 && progress === questions.length) {
      this._assessmentFinished()
    } else {
      this.setState({ current: current + 1 })
    }
  }

  // 标记测评完成并跳转测评结果页
  _assessmentFinished = async () => {
    const { relationsID } = this.state
    const res = await assessmentFinished(relationsID)
    if (res.status === 'success') {
      Taro.redirectTo({ url: `/pages/reportV2/index?relationsID=${relationsID}` })
    }
  }

  render() {
    const { questions, answer_snapshot, progress, current } = this.state
    const prevDisabled = current === 0
    const nextDisabled = current === progress
    const shareOptions = [
      {
        icon: wxIcon,
        text: '邀请好友测一测',
        type: 'assessment'
      }
    ]
    return (
      <View className='assessment'>
        <Progress percent={progress / questions.length * 100} strokeWidth={4} active activeColor='#FF8863' backgroundColor='#ECF1F2' activeMode='forwards' />
        <View className='progress-num'>
          {progress + '/' + questions.length}
        </View>

        <View className='question-wrap'>
          <View className='title'>
            {questions[current]?.title}
          </View>
          <RadioBars2
            data={questions[current]?.assessment_options || []}
            selected={answer_snapshot[current]?.answers[0].answer_id}
            onChange={this.handleRadioChange}
          />
        </View>

        <View className='controller-wrap'>
          <View
            className='controller'
            onClick={this.handlePrev}
          >
            <Image className='icon' src={prevDisabled ? prevDisabledIcon : prevIcon} />
            <Text className={`prev-text ${prevDisabled ? 'disabled' : ''}`}>
              上一题
            </Text>
          </View>
          <View
            className='controller'
            onClick={this.handleNext}
          >
            <Text className={`next-text ${nextDisabled ? 'disabled' : ''}`}>
              {(!nextDisabled && current === questions.length - 1 && progress === questions.length) ? '查看报告' : '下一题'}
            </Text>
            <Image className='icon' src={nextDisabled ? nextDisabledIcon : nextIcon} />
          </View>
        </View>

      </View>
    )
  }
}
