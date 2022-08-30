import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Text } from '@tarojs/components'
import { getRegisteredDetail } from '../../utils/query'
import CustomerService from '../../components/customerService'
import successIcon from '../../images/success_big.png'
import resultImg from '../../images/result_img.png'
import './index.less'

export default class FnterviewFinished extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
    show: false,
    result: {}
  }

  componentWillMount() { }

  componentDidMount() {
    this._getRegisteredDetail(this.state.registerID)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getRegisteredDetail = async (registerID) => {
    const res = await getRegisteredDetail(registerID)
    if (res.status === 'success') {
      this.setState({ result: res.data })
    }
  }

  handleShowDrawer = () => {
    this.setState({ show: true })
  }
  onHide = () => {
    this.setState({ show: false })
  }

  clickBtn = () => {
    const { registerID, result: { state } } = this.state
    let url = state === 'interview_passed' ? `/pages/agreementPreview/index?registerID=${registerID}` : '/pages/index/index'
    Taro.redirectTo({ url })
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
    const { show, result } = this.state
    return (
      <View className='interview-finished'>
        <CustomerService />
        <View className='status-wrap'>
          <Image src={successIcon} />
          <Text>您的面谈已完成！</Text>
        </View>
        <View className='desc'>
          GREAT! Parenting工作坊需要对您作一个详细评估以确定你是否适合参加此课程，因此我们将与您进行一次远程对视频面谈，您可以选择一个意向时间，我们将与您电话进行确认。感谢。
        </View>

        <View
          className='next-btn'
          onClick={this.handleShowDrawer}
        >
          查看面谈结果
        </View>

        {show && (
          <View
            className='mask'
            onClick={this.onHide}
          >
            <View
              className='result-wrap'
              onClick={e => e.stopPropagation()}
            >
              <View className='result-title'>
                面谈结果
              </View>
              {result.state === 'interview_passed' && (
                <Image className='result-img' src={resultImg} />
              )}

              <View className='result-desc'>
                {result.state === 'interview_passed' ?
                  `经过专家团队的讨论，我们确定您非常适合参与${result.event_title}，欢迎你来！请点击【确认】前往下一步`
                  :
                  `我们很抱歉的通知您，经过专家团队的讨论，${result.event_title}与您目前的养育阶段并不匹配。再次感谢您的时间和参与！也欢迎您继续关注Parent Lab的其他项目，期待继续为您服务～`
                }
                {result.state === 'interview_failed' && (
                  <View>
                    如需了解更多信息，欢迎咨询客服。
                  </View>
                )}
              </View>

              <View
                className='result-btn'
                onClick={this.clickBtn}
              >
                {result.state === 'interview_passed' ? '在线签署协议' : '返回首页'}
              </View>
            </View>

          </View>
        )}

      </View>
    )
  }
}
