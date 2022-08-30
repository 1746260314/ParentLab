import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text, PageContainer, PickerView, PickerViewColumn } from '@tarojs/components'
import { submitMeetingTime } from '../../utils/query'
import successIcon from '../../images/success_big.png'
import downIcon from '../../images/down.png'
import './index.less'

export default class Register extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
    show: false,
    weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    times: ['上午', '中午', '下午',],
    value: [],
    week: '周一',
    time: '上午',
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleShowDrawer = () => {
    this.setState({ show: true })
  }
  onHide = () => {
    this.setState({ show: false })
  }

  handleChangeTime = e => {
    const val = e.detail.value
    console.log(val)
    this.setState({
      week: this.state.weeks[val[0]],
      time: this.state.times[val[1]],
      value: val
    })
  }

  handleDetermine = async () => {
    const {registerID, week, time} = this.state
    const res = await submitMeetingTime({ expected_meeting_time: `${week}-${time}`}, registerID)
    if(res.status === 'success') {
      this.onHide()
      Taro.navigateTo({
        url: `/pages/registerFinished/index?registerID=${registerID}`,
      })
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
    return (
      <View className='register'>
        <View className='status-wrap'>
          <Image src={successIcon} />
          <Text>报名成功！</Text>
        </View>
        <View className='desc'>
          感谢您的支持！为了更完美的工作坊体验，我们设置了视频面谈环节，确保每一位学员都适合参加这一项目。您可点击下方按钮选择视频面谈时间，稍后我们将再次电话确认，感谢您的合作！
        </View>

        <View
          className='next-btn'
          onClick={this.handleShowDrawer}
        >
          选择时间
        </View>

        <PageContainer
          show={this.state.show}
          position='bottom'
          round
          onClickOverlay={this.onHide}
        >
          <View className='drawer'>
            <View className='title'>
              <Text>选择面谈时间</Text>
              <Image
                className='down-icon'
                src={downIcon}
                onClick={this.onHide}
              />
            </View>

            <PickerView
              indicatorStyle='height: 56px;'
              className='time-picker'
              value={this.state.value}
              onChange={this.handleChangeTime}
            >
              <PickerViewColumn>
                {this.state.weeks.map(item => (
                  <View key={item}>{item}</View>
                ))}
              </PickerViewColumn>
              <PickerViewColumn>
                {this.state.times.map(item => (
                  <View key={item}>{item}</View>
                ))}
              </PickerViewColumn>
            </PickerView>

            <View
              className='next-btn'
              onClick={this.handleDetermine}
            >
              确定
            </View>
          </View>
        </PageContainer>
      </View>
    )
  }
}
