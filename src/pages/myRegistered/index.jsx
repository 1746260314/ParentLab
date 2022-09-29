import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import { getRegisteredList } from '../../utils/query'
import { getQueryRegisterProgressUrl, formatTime } from '../../utils/util'
import Empty from '../../components/empty'
import './index.less'

export default class MyRegistered extends Component {

  state = {
    lists: [],
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    this._getRegisteredList()
  }

  componentDidHide() { }

  _getRegisteredList = async () => {
    const res = await getRegisteredList()
    if (res.status === 'success') {
      this.setState({ lists: res.data })
    }
  }

  travelToDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  queryProgress = (data) => {
    const { id, event_id, state } = data
    const hasProfile = Taro.getStorageSync('hasProfile')

    let url = getQueryRegisterProgressUrl(hasProfile, state, id, event_id)
    Taro.navigateTo({ url })
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

  render() {
    const { lists } = this.state
    return (
      <View className='my-registered'>
        {lists.map(item => (
          <View
            key={item.id}
            className='card'
          >
            <View className='time'>
              {item.registered_at && formatTime(new Date(item.registered_at).getTime(), 'Y/M/D h:m')}
            </View>
            <View className='title'>
              {item.event_title}
            </View>
            <View className='btn-wrap'>
              <View
                className='btn'
                onClick={() => this.travelToDetail(item.event_id)}
              >
                查看详情
              </View>
              <View
                className='btn'
                onClick={() => this.queryProgress(item)}
              >
                报名进度
              </View>
            </View>

          </View>
        ))}
        {lists.length === 0 && (
          <Empty />
        )}
      </View>
    )
  }
}
