import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import FormItem from '../../components/formItem'
import { PLInput, RadioBars, PLCheckbox } from '../../components/formElements'
import { getQuestionsForEventID, submitQuestionnaire } from '../../utils/query'

import './index.less'

export default class Questionnaire extends Component {

  state = {
    eventID: Taro.getCurrentInstance().router.params.eventID || 6,
    registerID: Taro.getCurrentInstance().router.params.registerID,
    questions: [],
    questionnaire: [],
  }

  componentWillMount() { }

  componentDidMount() {
    this._getQuestionsForEventID(this.state.eventID)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getQuestionsForEventID = async (eventID) => {
    const res = await getQuestionsForEventID(eventID)
    if (res.status === 'success') {
      this.setState({ questions: res.data })
    }
  }

  handleChange = (question, answer, index) => {
    let questionnaire = [...this.state.questionnaire]
    questionnaire[index] = {
      question,
      answer
    }
    this.setState({ questionnaire })
  }

  submit = async () => {
    const { questions, questionnaire, registerID, loading } = this.state
    if (loading) return
    let flag = true
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (!questionnaire[i]) {
        let error = question.question_type === 'short_answer' ? '必填项' : '必选项'
        this.setState({ [question.title + '_error']: error })
        flag = false
      }
    }

    if (!flag) {
      Taro.showToast({
        title: '请补全信息',
        icon: 'error',
        duration: 2000
      })
      return
    }

    const params = {
      operate: 'finish',
      event_registration: { questionnaire }
    }
    this.setState({ loading: true })
    const res = await submitQuestionnaire(params, registerID)
    if (res.status === 'success') {
      this.setState({ loading: false })
      let url = '';
      if (res.data.state === 'questionnaire_completed') {
        url = `/pages/register/index?registerID=${registerID}`
      } else if (res.data.state === 'to_be_signed') {
        url = `/pages/agreementPreview/index?registerID=${registerID}`
      }
      Taro.navigateTo({ url })
    }
  }

  // 配置分享
  onShareAppMessage () {
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  render() {
    const { questions, questionnaire } = this.state
    return (
      <View className='questionnaire'>
        {questions.map((question, index) => (
          <FormItem
            key={question.id}
            num={index + 1}
            required
            title={question.title}
            error={this.state[`${question.title}_error`]}
          >
            {question.question_type === 'short_answer' && (
              <PLInput
                placeholder='请输入。。'
                handleChange={e => this.handleChange(question.title, [e.target.value], index)}
              />
            )}

            {question.question_type === 'single' && (
              <RadioBars
                data={question.options}
                selected={questionnaire[index]?.answer[0]}
                onChange={value => this.handleChange(question.title, [value], index)}
              />
            )}

            {question.question_type === 'multiple' && (
              <PLCheckbox
                data={question.options}
                selected={questionnaire[index]?.answer || []}
                onChange={value => this.handleChange(question.title, value, index)}
              />
            )}

          </FormItem>
        )
        )}
        <View className='submit-btn-wrap'>
          <View
            className='submit-btn'
            onClick={this.submit}
          >
            提交
          </View>
        </View>

      </View>
    )
  }
}
