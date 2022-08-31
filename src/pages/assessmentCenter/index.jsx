import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import NavigatorFixed from '../../components/navigatorFixed'
import pageviewIcon from '../../images/pageview.png'
import './index.less'

const tabs = [
  { id: 0, title: '全部' },
  { id: 1, title: '孩子成长' },
  { id: 2, title: '夫妻关系' },
  { id: 3, title: '自我诊断' },
  { id: 4, title: '家庭关系' },
  { id: 5, title: '情感两性' },
  { id: 6, title: '情商&智商' },
]

const lists = [1, 2, 3]

export default class AssessmentCenter extends Component {

  state = {
    currentTab: 0,
  }

  componentWillMount() { }

  componentDidMount() { }

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

  handleChangeTab = (id) => {
    const { currentTab } = this.state
    if (id === currentTab) return
    this.setState({ currentTab: id })

  }



  render() {
    const { currentTab } = this.state
    return (
      <View className='assessment-center'>
        <NavigatorFixed selected={2} />
        <View className='tabs-bar'>
          {tabs.map(tab => (
            <View
              className={`tab ${tab.id === currentTab ? 'active' : ''}`}
              key={tab.id}
              onClick={() => this.handleChangeTab(tab.id)}
            >
              {tab.title}
            </View>
          ))}
        </View>


        {lists.map(card => (
          <View
            className='assessment-card'
            key={card}
          >
            <View className='tag'>
              自我诊断
            </View>
            <View className='title'>
              测一测你有多依赖你的另一半测一测你有多依赖你的另一半测一测你有多依赖你的另一半
            </View>
            <View className='desc'>
              这是一个评测简介说明，最多3行。这是一个评测简介说明，最多3行。这是一个评测简介说明，最多3行。这是一个评测简介说明，最多3行。这是一个评测简介说明，最多3行。这是一个评测简介说明，最多3行。
            </View>

            <View className='btn-bar'>
              <View className='pageview'>
                <Image className='icon' src={pageviewIcon} />
                1187人已测过
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
