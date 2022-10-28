import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button, Text, PageContainer } from '@tarojs/components'
import { getEventForID, registrations } from '../../utils/query'
import { } from '../../utils'
import img1 from '../../images/transition1.png'
import img2 from '../../images/transition2.png'
import downIcon from '../../images/down.png'
import './index.less'

export default class Transition extends Component {

  state = {
    eventID: Taro.getCurrentInstance().router.params.eventID,
    show: false,
    event: {},
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
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  // 配置分享
  onShareAppMessage() {
    return {
      title: this.state.event.wechat_share_title,
      path: `/pages/detail/index?id=${this.state.eventID}`,
      imageUrl: this.state.event.wechat_share_image_url
    }
  }

  _getEventForID = async (eventID) => {
    const res = await getEventForID(eventID)
    if (res.status === 'success') {
      this.setState({ event: res.data.event })
      this.initialData(res.data)
    }
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

    let city = ''
    let time = ''
    let skuID = ''
    if(skus.length === 1) {
      city = skus[0].hold_city || ''
      time = skus[0].hold_time || ''
      skuID = skus[0].id
    }

    this.setState({
      initialCitys,
      initialTimes,
      citys: initialCitys,
      times: initialTimes,
      city,
      time,
      skuID,
      citysMapping,
      timesMapping
    })
  }

  onShow = () => {
    this.setState({ show: true })
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
    const { city, time, skuID, eventID, event: { hold_form } } = this.state
    if ((city || hold_form === 'online') && time) {
      const res = await registrations({ event_sku_id: skuID })
      const { status, data: { id } } = res
      if (status === 'success') {
        Taro.redirectTo({ url: `/pages/payOrder/index?registerID=${id}` })
      } else {
        this.setState({ show: false })
      }
    }
  }


  render() {
    const { event, citys, city, times, time } = this.state
    return (
      <View className='transition'>
        <Image className='img1' src={img1} />
        <View className='desc'>
          若您在报名前有更多问题想要咨询
        </View>
        <View className='desc'>
          请点击这里
        </View>
        <Button className='btn btn-line' openType='contact'>
          我要咨询客服
        </Button>
        <Image className='img2' src={img2} />
        <View className='desc'>
          您也可以点击此处直接付款
        </View>
        <Button
          className='btn btn-full'
          onClick={this.onShow}
        >
          立即购买
        </Button>

        <PageContainer
          show={this.state.show}
          position='bottom'
          round
          onClickOverlay={this.onHide}
        >
          <View className='drawer'>
            <View className='label'>确认订单</View>
            <View className='price-bar'>
              <View className='units'>
                ￥
              </View>
              <View className='num'>
                88990.00
              </View>
              <View className='discounts'>
                限时优惠￥800
              </View>
            </View>
            <View className='selected'>
              已选择：{city + time}
            </View>
            <Image
              className='down-icon'
              src={downIcon}
              onClick={this.onHide}
            />

            <View className='sku-wrap'>
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
            </View>
            <View
              className={`next-btn ${(city || event.hold_form === 'online') && time && 'clickable'}`}
              onClick={this.next}
            >
              去支付
            </View>
          </View>
        </PageContainer>
      </View>
    )
  }
}
