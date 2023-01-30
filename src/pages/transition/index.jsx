import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Button, Text, PageContainer } from '@tarojs/components'
import { getEventForID, registrations } from '../../utils/query'
import { } from '../../utils'
import img1 from '../../images/transition1.png'
import img2 from '../../images/transition2.png'
import downIcon from '../../images/down.png'
import './index.less'

const app = getApp()
export default class Transition extends Component {

  state = {
    eventID: Taro.getCurrentInstance().router.params.eventID || 21,
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
    selectedSku: null,
    prices: [],
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
      initialTimes = data.event_skus.map(item => ({ ...item, id: item.id, time: item.hold_time, disable: false }))
    }

    let prices = Array.from(new Set(skus.map(item => item.list_price.cents))).sort((x, y) => x - y)

    let city = ''
    let time = ''
    let selectedSku = null
    if (skus.length === 1) {
      city = skus[0].hold_city || ''
      time = skus[0].hold_time || ''
      selectedSku = skus[0]
    }

    this.setState({
      initialCitys,
      initialTimes,
      citys: initialCitys,
      times: initialTimes,
      city,
      time,
      selectedSku,
      citysMapping,
      timesMapping,
      prices,
    })
  }

  onShow = () => {
    app.td_app_sdk.event({ id: '分流页面-立即购买' });
    this.setState({ show: true })
  }

  onHide = () => {
    this.setState({ show: false })
  }

  clickCity = (data) => {
    if (data.disable) return
    const { city, time, times, citysMapping, initialTimes } = this.state
    const newTimes = times.map(item => {
      let result = {}
      const optional = citysMapping[data.city].find(t => t.hold_time === item.time)
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
        selectedSku: null,
        times: initialTimes
      })
    } else {
      this.setState({
        city: data.city,
        times: newTimes,
      })
      if (time) {
        this.setState({
          selectedSku: citysMapping[data.city].find(item => item.id === data.id)
        })
      }
    }
  }

  clickTime = (data) => {
    if (data.disable) return
    const { time, city, citys, timesMapping, initialCitys, event } = this.state
    const newCitys = citys.map(item => {
      let result = {}
      const optional = timesMapping[data.time].find(c => c.hold_city === item.city)
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
        selectedSku: null,
        citys: initialCitys
      })
    } else {
      this.setState({
        time: data.time,
        citys: newCitys
      })

      if (city || event.hold_form === 'online') {
        this.setState({
          selectedSku: timesMapping[data.time].find(item => item.id === data.id)
        })
      }
    }
  }

  next = async () => {
    const { city, time, selectedSku, event: { hold_form } } = this.state
    if ((city || hold_form === 'online') && time) {
      const res = await registrations({ event_sku_id: selectedSku.id })
      const { status, data: { id } } = res
      if (status === 'success') {
        Taro.redirectTo({ url: `/pages/payOrder/index?registerID=${id}` })
      } else {
        this.setState({ show: false })
      }
    }
  }

  clickCustomerServiceEventTracking = () => {
    Taro.openCustomerServiceChat({
      extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc0c9e5be8f3287b99'},
      corpId: 'ww4a9a6e350546d299',
    })
    app.td_app_sdk.event({ id: '分流页面-客服按钮点击' });
  }

  render() {
    const { event, citys, city, times, time, selectedSku, prices } = this.state
    return (
      <View className='transition'>
        <View className='block'>
          <Image className='img1' src={img1} />
          <View className='desc'>
            若您在报名前有更多问题想要咨询
          </View>
          <View className='desc'>
            请点击这里
          </View>
          <View className='btn btn-line' onClick={this.clickCustomerServiceEventTracking} >
            我要咨询客服
          </View>
        </View>

        <View className='block'>
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

        </View>

        <PageContainer
          show={this.state.show}
          position='bottom'
          round
          onClickOverlay={this.onHide}
        >
          <View className='drawer'>
            <View className='label'>确认订单</View>
            {selectedSku ? (
              <View className='price-bar'>
                <View className='units'>
                  ￥
                </View>
                <View className='num'>
                  {(selectedSku?.current_price?.cents / 100).toFixed(2)}
                </View>
                {selectedSku?.current_promotion_price && (
                  <View className='discounts'>
                    限时优惠￥{(selectedSku?.current_promotion_price?.cents / 100).toFixed(2)}
                  </View>
                )}
              </View>
            ) : (
              <View className='price-section'>
                <View className='units'>
                  ￥
                </View>
                <View className='num'>
                  {(prices[0] / 100).toFixed(2)} {prices.length > 1 && ('- ' + (prices[prices.length - 1] / 100).toFixed(2))}
                </View>
              </View>
            )}

            {selectedSku && selectedSku?.current_promotion_price && (
              <View className='list-price'>
                原价：￥{(selectedSku?.list_price?.cents / 100).toFixed(2)}
              </View>
            )}

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
                  className={`time-option ${item.time === time ? 'active' : ''} ${item.disable ? 'disable' : ''}`}
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
