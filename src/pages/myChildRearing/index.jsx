import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image, Progress } from '@tarojs/components'
import { RadioBars, PLCheckbox, PLTextarea } from '../../components/formElements'
import { getOnboarding, saveOnboarding, getUserOnboarding } from '../../utils/query'
import prevDisabledIcon from '../../images/prev_disabled.png'
import prevIcon from '../../images/prev.png'
import nextDisabledIcon from '../../images/next_disabled.png'
import nextIcon from '../../images/next.png'
import forkIcon from '../../images/fork.png'

import './index.less'

export default class Assessment extends Component {

  state = {
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    version: Taro.getCurrentInstance().router.params.version,
    questions: [],
    answer_snapshot: [],
    current: 0,
    progress: 0,
    showTips: false,
  }

  componentWillMount() { }

  componentDidMount() {
    this._getOnboarding()
    this._getUserOnboarding()
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

  // 获取题目
  _getOnboarding = async (params) => {
    const res = await getOnboarding(params)
    if (res.status === 'success') {
      const { questions = [] } = res.data
      this.setState({ questions })
    }
  }

  // 获取用户答题信息
  _getUserOnboarding = async (params) => {
    const res = await getUserOnboarding(params)
    if (res.status === 'success') {
      const answer_snapshot = res.data.answer_snapshot || []
      this.setState({
        answer_snapshot: answer_snapshot,
        progress: answer_snapshot.length,
        showTips: answer_snapshot.length > 0
      })
    }
  }

  hideTips = () => {
    this.setState({ showTips: false })
  }

  // 单选题选择处理器
  handleRadioChange = (value) => {
    const { questions, answer_snapshot, current, progress } = this.state
    let answerSnapshot = [...answer_snapshot]
    answerSnapshot[current] = {
      question_id: questions[current].id,
      question_title: questions[current].title,
      answers: [value]
    }
    this.setState(
      {
        answer_snapshot: answerSnapshot,
        progress: current === progress ? progress + 1 : progress
      },
      () => this.handleNext()
    )
  }

  // 多选题处理器
  handleCheckboxChange = (value) => {
    const { questions, answer_snapshot, current, progress } = this.state
    let answerSnapshot = [...answer_snapshot]
    answerSnapshot[current] = {
      question_id: questions[current].id,
      question_title: questions[current].title,
      answers: value
    }
    this.setState({
      answer_snapshot: answerSnapshot,
      progress: current === progress ? progress + 1 : progress
    })
  }

  // 文本题处理器
  handleTextareaChange = (e) => {
    const value = e.target.value
    const { questions, answer_snapshot, current, progress } = this.state
    let answerSnapshot = [...answer_snapshot]
    answerSnapshot[current] = {
      question_id: questions[current].id,
      question_title: questions[current].title,
      answers: value ? [value] : []
    }
    this.setState({
      answer_snapshot: answerSnapshot,
      progress: current === progress ? progress + 1 : progress
    })
  }

  // 上一题
  handlePrev = () => {
    const { current } = this.state
    const disabled = current === 0
    if (disabled) return
    this.setState({ current: current - 1 })
  }

  // 下一题
  handleNext = () => {
    const { current, progress, answer_snapshot } = this.state
    const disabled = current === progress || !(answer_snapshot[current]?.answers.length > 0)
    if (disabled) return
    this.setState({ current: current + 1 })
  }

  // 保存
  _saveOnboarding = async () => {
    const { answer_snapshot, questions, assessmentID, version } = this.state
    if (answer_snapshot[questions.length - 1].answers.length === 0) return
    const params = {
      survey: {
        slug: "onboarding",
        answer_snapshot
      }
    }
    const res = await saveOnboarding(params)
    if (res.status === 'success') {
      if (assessmentID) {
        const url = `/pages/${version}/index?assessmentID=${assessmentID}`
        Taro.redirectTo({ url })
      } else {
        Taro.navigateBack()
      }
    }
  }

  render() {
    const { questions = [], answer_snapshot, progress, current, showTips } = this.state
    const prevDisabled = current === 0
    const nextDisabled = current === progress || !(answer_snapshot[current]?.answers.length > 0)
    const finishedDisabled = !(answer_snapshot[questions.length - 1]?.answers.length > 0)
    const question = questions[current] || {}
    const type = question.question_type
    const options = (question?.survey_options || []).map(item => item.title)

    return (
      <View className='my-child-rearing'>
        <Progress
          percent={progress / questions.length * 100}
          strokeWidth={4}
          active
          activeColor='#FF8863'
          backgroundColor='#ECF1F2'
          activeMode='forwards'
        />

        {showTips && current === 0 && (
          <View className='tips-bar'>
            <Text>这是您上次填写养育状态时的选项</Text>
            <Image
              className='icon'
              src={forkIcon}
              onClick={this.hideTips}
            />
          </View>
        )}

        <View className='progress-num'>
          {(current + 1) + '/' + questions.length}
        </View>

        <View className='question-wrap'>
          <View className='title'>
            {question?.title}
          </View>
          {(type === 'single' || type === 'boolean') && (
            <RadioBars
              data={options}
              selected={answer_snapshot[current]?.answers[0] || ''}
              onChange={this.handleRadioChange}
            />
          )}
          {(type === 'multiple') && (
            <PLCheckbox
              data={options}
              selected={answer_snapshot[current]?.answers || []}
              onChange={this.handleCheckboxChange}
            />
          )}
          {(type === 'other') && (
            <PLTextarea
              type='text'
              data-name='parenting_feeling'
              value={answer_snapshot[current]?.answers[0] || ''}
              handleChange={this.handleTextareaChange}
            />
          )}
        </View>

        {(current === questions.length - 1) ? (
          <View
            className={`finished-btn ${finishedDisabled ? 'btn-disabled' : ''}`}
            onClick={this._saveOnboarding}
          >
            完成
          </View>
        ) : (
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
            {(type === 'multiple' || type === 'other') && (
              <View
                className={`confirm-btn ${nextDisabled ? 'btn-disabled' : ''}`}
                onClick={this.handleNext}
              >
                提交
              </View>
            )}
            <View
              className='controller'
              onClick={this.handleNext}
            >
              <Text className={`next-text ${nextDisabled ? 'disabled' : ''}`}>
                {(current === questions.length - 1 && progress === questions.length) ? '查看报告' : '下一题'}
              </Text>
              <Image className='icon' src={nextDisabled ? nextDisabledIcon : nextIcon} />
            </View>
          </View>
        )}
      </View>
    )
  }
}
