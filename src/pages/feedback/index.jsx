import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Textarea } from '@tarojs/components'
import { } from '../../utils/query'
import './index.less'

const app = getApp()
const tagData = ['测的不准', '过程体验不好', '报告解读看不懂', '视觉不够好看', '哪儿哪儿都不行',]
export default class Feedback extends Component {

  state = {
    slotPoint: [],
    content: '',
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClickTag = (value) => {
    const { slotPoint } = this.state
    let result = []
    if (slotPoint.includes(value)) {
      result = slotPoint.filter(i => i !== value)
    } else {
      result = [...slotPoint, value]
    }
    this.setState({ slotPoint: result })
  }

  handleChangeContent = (e) => {
    this.setState({ content: e.target.value })
  }

  submit = () => {
    const { slotPoint, content } = this.state
    if(slotPoint.length > 0 || content) {

    } else {
      return
    }
  }

  render() {
    const { slotPoint, content } = this.state

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
                className={slotPoint.includes(item) ? 'option-active' : 'option'}
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
            onBlur={this.handleChangeContent}
          />
        </View>

        <View 
          className={(slotPoint.length > 0 || content) ? 'btn' : 'btn-disabled'}
          onClick={this.submit}
        >
          告诉大老板
        </View>

      </View>
    )
  }
}
