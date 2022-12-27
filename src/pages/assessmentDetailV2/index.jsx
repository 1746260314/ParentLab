import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { getAssessmentDetail } from '../../utils/query'
import ShareFixed from '../../components/shareFixed'
import wxIcon from '../../images/wx_icon.png'
import arrowUp from '../../images/arrow_up.png'
import arrowDown from '../../images/arrow_down.png'
import './index.less'

const app = getApp()
export default class AssessmentDetailV2 extends Component {

  state = {
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    data: {},
    showHintPop: false,
  }

  componentWillMount() { }

  componentDidMount() {
    const { assessmentID } = this.state
    console.log(Taro.getStorageSync(`showHintPop${assessmentID}`))
    const showHintPop = !Taro.getStorageSync(`assessment_detail_hint_pop_${assessmentID}`)
    console.log(showHintPop)
    this.setState({ showHintPop })
    this._getAssessmentDetail(assessmentID)
    setTimeout(() => {
      Taro.setStorageSync(`assessment_detail_hint_pop_${assessmentID}`, true)
      this.setState({ showHintPop: false })
    }, 6000)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 分享配置
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
      app.td_app_sdk.event({ id: '评测详情-分享2' });
      const { data: { wechat_share_title, wechat_share_image_url }, assessmentID } = this.state
      return {
        title: wechat_share_title,
        path: `/pages/assessmentDetailV2/index?assessmentID=${assessmentID}`,
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

  // 获取测试详情数据
  _getAssessmentDetail = async (assessmentID) => {
    const res = await getAssessmentDetail(assessmentID)
    if (res.status === 'success') {
      this.setState({ data: res.data })
      Taro.setNavigationBarTitle({
        title: res.data.title
      })
    }
  }

  //展开收起
  control = (id) => {
    this.setState({ [`open${id}`]: !this.state[`open${id}`] })
  }

  clickStart = () => {
    app.td_app_sdk.event({ id: '评测详情-开始答题' });
    try {
      const { assessmentID } = this.state
      const token = Taro.getStorageSync('token')
      const hasUserPhoneNumber = Taro.getStorageSync('hasUserPhoneNumber')
      const url = `/pages/assessmentV2/index?assessmentID=${assessmentID}`
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
    const { data, showHintPop } = this.state
    const shareOptions = [
      {
        icon: wxIcon,
        text: '邀请好友测一测',
        type: 'assessment'
      }
    ]

    return (
      <View className='detail'>

        {showHintPop && (
          <View className='hint-pop'>
            <View className='pop'>
              点击这里邀请好友一起测一测
            </View>
          </View>
        )}

        <Image className='detail-img' src={data.banner_image_url} mode='widthFix' />

        <View className='container'>
          <View className='tag-bar'>
            {data.tags?.map((tag, index) => (
              <View className='tag' key={index}>{tag}</View>
            ))}
          </View>

          <View className='title'>
            {data.title}
          </View>

          <View className='desc'>
            {data.short_desc}
          </View>

          <View className='quantity-bar'>
            <View className='tag'>
              <View className='quantity-num'>
                {data.assessment_questions_count}道
              </View>
              <View className='quantity-matter'>
                测试题目数量
              </View>
            </View>
            <View className='tag'>
              <View className='quantity-num'>
                {data.duration_minutes}分钟
              </View>
              <View className='quantity-matter'>
                完成所需时间
              </View>
            </View>
          </View>

          {data.references?.length > 0 && (
            <View className='source'>
              <View className='label'>
                文献来源
              </View>
              {data.references.map((item, index) => (
                <View className='item' key={index}>
                  {item}
                </View>
              ))}
            </View>
          )}

          {data.intro_items?.map(item => (
            <View className='description' key={item.id}>
              <View className='title'>
                <View className='decorate'></View>
                {item.title}
              </View>
              <View className={(item.plain_content.length > 100 && !this.state[`open${item.id}`]) ? 'content-hide' : 'content'}>
                {item.plain_content}
              </View>
              {item.plain_content.length > 100 && (
                <View
                  className='control'
                  onClick={() => this.control(item.id)}
                >
                  {this.state[`open${item.id}`] ? '收起' : '展开'}
                  <Image className='icon' src={this.state[`open${item.id}`] ? arrowDown : arrowUp} />
                </View>
              )}
            </View>
          ))}
        </View>


        <View className='btn-wrap'>
          {data.is_enabled ? (
            <View className='btn' onClick={this.clickStart}>
              开始测试
            </View>
          ) : (
            <View className='btn-disable'>
              即将上线，敬请关注
            </View>
          )}
        </View>

        <ShareFixed options={shareOptions} />
      </View>
    )
  }
}
