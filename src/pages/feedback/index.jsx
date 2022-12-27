import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Textarea } from '@tarojs/components'
import { feedbacks } from '../../utils/query'
import './index.less'

const tagData = ['测的不准', '过程体验不好', '报告解读看不懂', '视觉不够好看', '哪儿哪儿都不行',]
export default class Feedback extends Component {

  state = {
    tags: [],
    content: '',
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClickTag = (value) => {
    const { tags } = this.state
    let result = []
    if (tags.includes(value)) {
      result = tags.filter(i => i !== value)
    } else {
      result = [...tags, value]
    }
    this.setState({ tags: result })
  }

  handleChangeContent = (e) => {
    this.setState({ content: e.detail.value })
  }

  submit = async () => {
    const { tags, content } = this.state
    if (tags.length > 0 || content) {
      const res = await feedbacks({ tags, content })
      if (res.status === 'success') {
        Taro.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        Taro.navigateBack({
          delta: 1
        })
      }
    } else {
      return
    }
  }

  render() {
    const { tags, content } = this.state

    return (
      <View className='feedback'>

        <View className='container'>
          <View className='desc'>
            很抱歉这次测评没有给您带来美好的感受，请狠狠地吐槽我们，我们会做得更好的！ORZ
          </View>
          <View className='label'>
            槽点
          </View>

          <View className='multiple-tags'>
            {tagData.map((item, index) => (
              <View
                className={tags.includes(item) ? 'option-active' : 'option'}
                key={index}
                onClick={() => this.handleClickTag(item)}
              >
                {item}
              </View>
            ))}
          </View>

          <View className='label'>
            使劲吐槽
          </View>

          <Textarea
            className='content'
            placeholder='输入内容'
            onInput={this.handleChangeContent}
          />
        </View>

        <View
          className={(tags.length > 0 || content) ? 'btn' : 'btn-disabled'}
          onClick={this.submit}
        >
          告诉大老板
        </View>

      </View>
    )
  }
}
