import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getAssessmentDetail } from '../../utils/query'
import ShareContainer from '../../components/shareContainer'
import wxIcon from '../../images/wx_icon.png'
import './index.less'

const app = getApp()
export default class Detail extends Component {

  state = {
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    data: {},
  }

  componentWillMount() { }

  componentDidMount() {
    this._getAssessmentDetail(this.state.assessmentID)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      app.td_app_sdk.event({ id: '评测详情-分享2' });
      const { data: { wechat_share_title, wechat_share_image_url }, assessmentID } = this.state
      return {
        title: wechat_share_title,
        path: `/pages/assessmentDetail/index?assessmentID=${assessmentID}`,
        imageUrl: wechat_share_image_url
      }
    }
    app.td_app_sdk.event({ id: '评测详情-分享1' });
    const shareTitle = Taro.getStorageSync('shareTitle')
    const shareImg = Taro.getStorageSync('shareImg')
    return {
      title: shareTitle,
      path: '/pages/index/index',
      imageUrl: shareImg
    }
  }

  _getAssessmentDetail = async (assessmentID) => {
    const res = await getAssessmentDetail(assessmentID)
    if (res.status === 'success') {
      this.setState({ data: res.data })
      Taro.setNavigationBarTitle({
        title: res.data.title
      })
    }
  }

  clickStart = () => {
    app.td_app_sdk.event({ id: '评测详情-开始答题' });
    try {
      const { assessmentID } = this.state
      const token = Taro.getStorageSync('token')
      const hasUserPhoneNumber = Taro.getStorageSync('hasUserPhoneNumber')
      const url = `/pages/assessment/index?assessmentID=${assessmentID}`
      if (token && hasUserPhoneNumber) {
        Taro.navigateTo({ url })
      } else {
        Taro.navigateTo({ url: `/pages/login/index?&redirectUrl=/pages/assessment/index&paramsKey=assessmentID&paramsValue=${assessmentID}` })
      }
    } catch (e) {
      // Do something when catch error
    }
  }

  render() {
    const { data } = this.state
    const { body_image_urls = [], is_enabled } = data
    const shareOptions = [
      {
        icon: wxIcon,
        text: '邀请好友测一测',
        type: 'assessment'
      }
    ]
    return (
      <View className='detail'>
        {/* {body_image_urls.map((img, index) => (
          <Image className='detail-img' src={img} key={index} mode='widthFix' />
        ))} */}
        <Image className='detail-img' mode='widthFix' />

        <View className='container'>
          <View className='tag-bar'>
            <View className='tag'>11</View>
            <View className='tag'>22</View>
            <View className='tag'>33</View>
          </View>

          <View className='title'>
            测一测你有多依赖你的另一半测一测你有多依赖你的另一半测一测你有多依赖你的另一半测一测你有多依赖你的另一半测一测你有多依赖你的另一半测一测你有多依赖你的另一半
          </View>

          <View className='desc'>
            本测试于2018年由美国心理学家Susan Harter以及早期学习专家Jane Haltiwanger共同设计而成，旨在帮助家长（或者教师）了解孩子对自我价值的认可水平。
          </View>

          <View className='quantity-bar'>
            <View className='tag'>
              <View className='quantity-num'>33道</View>
              <View className='quantity-matter'>123124123</View>
            </View>
            <View className='tag'>
              <View className='quantity-num'>122道</View>
              <View className='quantity-matter'>阿斯顿发</View>
            </View>
          </View>

          <View className='source'>
            <View className='label'>
              文献来源
            </View>
            <View className='item'>
              [1]  Haltiwanger, J., & Harter, S. (1988). The behavioral rating scale of presented self-esteem in young children. Denver: University of Denver.
            </View>
            <View className='item'>
              [2]  Haltiwanger, J., & Harter, S. (1988). The behavioral rating scale of presented self-esteem in young children.
            </View>
          </View>

          <View className='description'>
            <View className='title'>
              <View className='decorate'></View>
              这是个什么样的测试？
            </View>
            <View className='content'>
              本测试于2018年由美国心理学家Susan Harter以及早期学习专家Jane Haltiwanger共同设计而成，旨在帮助家长（或者教师）了解孩子对自我价值的认可水平。
            </View>
          </View>

          <View className='description'>
            <View className='title'>
              <View className='decorate'></View>
              这个测试有什么用？
            </View>
            <View className='content'>
            本测试于2018年由美国心理学家Susan Harter以及早期学习专家Jane Haltiwanger共同设计而成，旨在帮助家长（或者教师）了解孩子对自我价值的认可水平。本测试于2018年由美...
            </View>
          </View>

          <View className='description'>
            <View className='title'>
              <View className='decorate'></View>
              我可以收获什么？
            </View>
            <View className='content'>
              本测试于2018年由美国心理学家Susan Harter以及早期学习专家Jane Haltiwanger共同设计而成，旨在帮助家长（或者教师）了解孩子对自我价值的认可水平。本测试于2018年由美国心理学家Susan Harter以及早期学习专家Jane Haltiwanger共同设计而成，旨在帮助家长（或者教师）了解孩子对自我价值的认可水平。
            </View>
          </View>

        </View>


        <View className='btn-wrap'>
          {is_enabled ? (
            <View className='btn' onClick={this.clickStart}>
              开始测试
            </View>
          ) : (
            <View className='btn-disable'>
              即将上线，敬请关注
            </View>
          )}
        </View>

        <ShareContainer options={shareOptions} />
      </View>
    )
  }
}
