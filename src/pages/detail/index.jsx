import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Image, PageContainer } from '@tarojs/components'
import { getEventForID, updateUsersWechatInfo, registrations } from '../../utils/query'
import { getQueryRegisterProgressUrl } from '../../utils/util'
import { login } from '../../utils/weChatLogin'
import CustomerService from '../../components/customerService'
import downIcon from '../../images/down.png'
import './index.less'

export default class Detail extends Component {

  state = {
    eventID: Taro.getCurrentInstance().router.params.id,
    show: false,
    data: {},
    initialTimes: [],
    initialTimes: [],
    citys: [],
    times: [],
    citysMapping: {},
    timesMapping: {},
    city: '',
    time: '',
    skuID: '',
  }

  componentWillMount() { }

  componentDidMount() {
    this._getEventForID(this.state.eventID)
    // Taro.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    // })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getEventForID = async (eventID) => {
    const res = await getEventForID(eventID)
    if (res.status === 'success') {
      this.setState({ data: res.data })
      this.initialData(res.data)
      Taro.setNavigationBarTitle({
        title: res.data.event.title
      })
    }
  }

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    } 
    return {
      title: this.state.data.event.wechat_share_title,
      path: `/pages/detail/index?id=${this.state.eventID}`,
      imageUrl: this.state.data.event.wechat_share_image_url
    }
  }

  // onShareTimeline () {
  //   return {
  //     title: this.state.data.event.title,
  //     path: `/pages/detail/index?id=${this.state.eventID}`,
  //   }
  // }

  signUp = () => {
    try {
      const token = Taro.getStorageSync('token')
      const hasUserWeChatInfo = Taro.getStorageSync('hasUserWeChatInfo')
      if (token && hasUserWeChatInfo) {
        this.setState({ show: true })
      } else {
        !token && login()
        this.getUserProfile()
      }
    } catch (e) {
      // Do something when catch error
    }
  }

  getUserProfile = () => {
    let _this = this
    Taro.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        _this.setState({ show: true })
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        Taro.setStorageSync('hasUserWeChatInfo', true)
        const { avatarUrl, gender, nickName, ...other } = res.userInfo
        const params = {
          wechat_user: {
            ...other,
            sex: gender,
            headimgurl: avatarUrl,
            nickname: nickName,
          }
        }
        updateUsersWechatInfo(params)
      }
    })
  }

  initialData = (data) => {
    const citys = data.event?.hold_city_options || []
    const times = data.event?.hold_time_options || []
    const skus = data.event_skus || []
    const citysMapping = {}
    const timesMapping = {}

    citys.forEach(item => {
      const timeFroCity = []
      skus.forEach(sku => {
        if (sku.hold_city === item) {
          timeFroCity.push(sku)
        }
      })
      citysMapping[item] = timeFroCity
    })

    times.forEach(item => {
      const cityFroTime = []
      skus.forEach(sku => {
        if (sku.hold_time === item) {
          cityFroTime.push(sku)
        }
      })
      timesMapping[item] = cityFroTime
    })

    const initialInfo = { disable: false }
    const initialCitys = citys.map(city => {
      return { city, ...initialInfo }
    })
    let initialTimes = times.map(time => {
      return { time, ...initialInfo }
    })

    if (data.event.hold_form === 'online') {
      initialTimes = data.event_skus.map(item => { return { id: item.id, time: item.hold_time, disable: false } })
    }

    this.setState({
      initialCitys,
      initialTimes,
      citys: initialCitys,
      times: initialTimes,
      citysMapping,
      timesMapping
    })
  }

  onHide = () => {
    this.setState({ show: false })
  }

  clickCity = (data) => {
    if (data.disable) return
    const { city, times, citysMapping, initialTimes } = this.state
    const newTimes = times.map(item => {
      let result = {}
      const optional = citysMapping[data.city].find(time => time.hold_time === item.time)
      if (optional) {
        result = { ...item, disable: false, id: optional.id }
      } else {
        result = { ...item, disable: true }
      }
      return result
    })

    if (data.city === city) {
      this.setState({
        city: '',
        skuID: '',
        times: initialTimes
      })
    } else {
      this.setState({
        city: data.city,
        skuID: data.id || '',
        times: newTimes
      })
    }
  }

  clickTime = (data) => {
    if (data.disable) return
    const { time, citys, timesMapping, initialCitys } = this.state
    const newCitys = citys.map(item => {
      let result = {}
      const optional = timesMapping[data.time].find(city => city.hold_city === item.city)
      if (optional) {
        result = { ...item, disable: false, id: optional.id }
      } else {
        result = { ...item, disable: true }
      }
      return result
    })
    if (data.time === time) {
      this.setState({
        time: '',
        skuID: '',
        citys: initialCitys
      })
    } else {
      this.setState({
        time: data.time,
        skuID: data.id || '',
        citys: newCitys
      })
    }
  }

  next = async () => {
    const { city, time, skuID, eventID, data } = this.state
    const { event: { hold_form } } = data
    const hasProfile = Taro.getStorageSync('hasProfile')
    if ((city || hold_form === 'online') && time) {
      const res = await registrations({ event_sku_id: skuID })
      const { status, data: { state, id } } = res
      if (status === 'success') {
        let url = getQueryRegisterProgressUrl(hasProfile, state, id, eventID)
        Taro.navigateTo({ url })
      } else {
        this.setState({ show: false })
      }
    }
  }

  render() {
    const { data, city, time, citys, times } = this.state
    const { event_images = [], event = {} } = data
    return (
      <View className='detail'>
        <CustomerService />
        {event_images.map((img, index) => (
          <Image className='detail-img' src={img} key={index} mode='widthFix' />
        ))}
        <View className='btn-wrap'>
          {event.allow_registration ? (
            <View className='btn' onClick={this.signUp}>
              我要报名
            </View>
          ) : (
            <View className='btn-disable'>
              即将上线，敬请关注
            </View>
          )}

        </View>

        <PageContainer
          show={this.state.show}
          position='bottom'
          round
          onClickOverlay={this.onHide}
        >
          <View className='drawer'>
            <Image
              className='down-icon'
              src={downIcon}
              onClick={this.onHide}
            />
            {event.hold_form === 'offline' && (
              <View className='title'>
                <Text>选择城市</Text>
              </View>
            )}

            {event.hold_form === 'offline' && (
              <View className='city-options'>
                {citys.map(item => (
                  <View
                    key={item.city}
                    className={`option ${item.city === city ? 'active' : ''} ${item.disable ? 'disable' : ''}`}
                    onClick={() => this.clickCity(item)}
                  >
                    {item.city}
                  </View>
                ))}
              </View>
            )}


            <View className='title'>
              <Text>选择时间</Text>
            </View>
            {times.map(item => (
              <View
                key={item.time}
                className={`option ${item.time === time ? 'active' : ''} ${item.disable ? 'disable' : ''}`}
                onClick={() => this.clickTime(item)}
              >
                {item.time}
              </View>
            ))}
            <View
              className={`next-btn ${(city || event.hold_form === 'online') && time && 'clickable'}`}
              onClick={this.next}
            >
              下一步
            </View>
          </View>
        </PageContainer>
      </View>
    )
  }
}
