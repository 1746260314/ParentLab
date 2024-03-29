import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import home from '../../images/home.png'
import homeActive from '../../images/home_active.png'
import book from '../../images/book.png'
import bookActive from '../../images/book_active.png'
import personal from '../../images/personal.png'
import personalActive from '../../images/personal_active.png'
import assessment from '../../images/assessment.png'
import assessmentActive from '../../images/assessment_active.png'

import './index.less'

export default class NavigatorFixed extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  go = (item) => {
    if (item.key === this.props.selected) return
    const { onClick } = this.props
    onClick && onClick()
    var token = Taro.getStorageSync('token')
    if(item.key === 4 && !token) {
      Taro.redirectTo({ url: '/pages/login/index?redirectUrl=/pages/personalCenter/index' })
    }  else {
      Taro.redirectTo({
        url: item.path
      })
    }
  }

  navData = [
    // { key: 1, activeIcon: homeActive, icon: home, label: '成长营', path: '/pages/index/index' },
    { key: 2, activeIcon: bookActive, icon: book, label: '家长教练', path: '/pages/index/index' },
    // { key: 2, activeIcon: bookActive, icon: book, label: '家长教练', path: '/pages/parentCoach/index' },
    { key: 3, activeIcon: assessmentActive, icon: assessment, label: '养育测试', path: '/pages/assessmentCenter/index' },
    { key: 4, activeIcon: personalActive, icon: personal, label: '个人中心', path: '/pages/personalCenter/index' },
  ]
  render() {
    const { selected } = this.props
    return (
      <View className='navigator-fixed'>
        {this.navData.map((item) => (
          <View
            className='item'
            key={item.key}
            onClick={() => this.go(item)}
          >
            <View className='icon'>
              <Image src={selected === item.key ? item.activeIcon : item.icon} />
            </View>
            <Text className={selected === item.key ? 'label active' : 'label'}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    )
  }
}
