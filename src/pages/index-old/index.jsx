import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Swiper, SwiperItem, Canvas } from '@tarojs/components'
import NavigatorFixed from '../../components/navigatorFixed'
import CustomerService from '../../components/customerService'
import { getHomepageBanners, getHomepageEvents } from '../../utils/query'
// import Charts from '../../utils/wxcharts-min.js'
import './index.less'

const app = getApp()
export default class Index extends Component {

  state = {
    banners: [],
    events: [],
    chartsData: [{ name: '狮子狮子狮子狮子狮子狮子狮子狮子', data: 40 }, { name: '我的我的我的我的我的我的', data: 12 }, { name: '狮子狮子狮子狮子狮子狮子狮子狮子', data: 30 }, { name: '狮子狮子狮子狮子狮子狮子狮子狮子', data: 20 }, { name: '狮子狮子狮子狮子狮子狮子狮子狮子', data: 18 }]
  }

  componentWillMount() { }

  componentDidMount() {
    this._getHomepageBanners()
    this._getHomepageEvents()

    // let windowWidth = 370;
    // try {
    //   let res = Taro.getSystemInfoSync();
    //   windowWidth = res.windowWidth;
    // } catch (e) {
    //   // do something when get system info failed
    // }

    // this.charts = new Charts({
    //   canvasId: 'canvas1',
    //   type: 'pie',
    //   series: this.state.chartsData,
    //   width: windowWidth,
    //   height: 400,
    //   dataLabel: true,
    //   // legend: false,
    //   // dataPointShape: false,
    // });

    // new Charts({
    //   canvasId: 'canvas2',
    //   dataPointShape: false,
    //   type: 'column',
    //   categories: ['狮子狮子狮子狮子狮子狮子狮子狮子', '我的我的我的我的我的我的', '老虎', '小鸟', '鲸鱼'],
    //   series: [{
    //     name: '得分',
    //     data: [40, 12, 30, 20, 18],
    //   }],
    //   xAxis: {
    //     disableGrid: true,
    //   },
    //   width: windowWidth,
    //   height: 400,
    //   dataLabel: true,
    //   legend: false,
    // });

    // new Charts({
    //   canvasId: 'canvas3',
    //   dataPointShape: false,
    //   type: 'column',
    //   categories: ['7月', '8月', '9月', '10月', '12月', '12月'],
    //   series: [{
    //     name: '线下',
    //     data: [15, 20, 45, 37, 4, 80],
    //     color: "rgba(0,0,0,0.3)"//支持rgba，但不支持渐变色     
    //   }, {
    //     name: '公众号',
    //     data: [70, 40, 65, 100, 34, 18]
    //   }, {
    //     name: '小程序',
    //     data: [100, 50, 75, 188, 15, 13]
    //   }],
    //   yAxis: {
    //     format: function (val) {
    //       return val + '份';
    //     }
    //   },
    //   xAxis: {
    //     disableGrid: true,
    //   },
    //   width: windowWidth,
    //   height: 400,
    //   dataLabel: true,
    // });
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getHomepageBanners = async () => {
    const res = await getHomepageBanners()
    if (res.status === 'success') {
      this.setState({ banners: res.data })
    }
  }

  _getHomepageEvents = async () => {
    const res = await getHomepageEvents()
    if (res.status === 'success') {
      this.setState({ events: res.data })
    }
  }

  travelTo = (data) => {
    app.td_app_sdk.event({ id: 'home-banner点击' });
    let url = ''
    if (data.banner_type === 'external') {
      url = `/pages/bannerDetail/index?url=${data.target_link}`
    } else {
      url = data.target_link
    }
    Taro.navigateTo({ url })
  }

  toDetail = (id) => {
    app.td_app_sdk.event({ id: 'home-产品点击' });
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
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

  clickCustomerServiceEventTracking = () => {
    app.td_app_sdk.event({ id: 'home-客服按钮点击' });
  }

  clickNavigatorEventTracking = () => {
    app.td_app_sdk.event({ id: 'home-导航点击' });
  }

  touchHandler = (e) => {
    const index = this.charts.getCurrentDataIndex(e)
    const { chartsData } = this.state
    if (index !== -1) {
      Taro.showModal({
        title: '你点击了',
        content: chartsData[index].name + '，数值:' + chartsData[index].data
      })
    }
  }

  render() {
    const { banners, events } = this.state
    return (
      <View className='index'>

        {/* <Canvas canvasId='canvas1' className='pie' onTouchStart={this.touchHandler}></Canvas>
        <Canvas canvasId='canvas2' className='column'></Canvas>
        <Canvas canvasId='canvas3' className='column'></Canvas> */}

        <CustomerService onClick={this.clickCustomerServiceEventTracking} />
        {banners.length > 0 && (
          <Swiper
            className='swiper'
            indicatorColor='#D3E3E7'
            indicatorActiveColor='#FF8863'
            circular
            indicatorDots
            autoplay
          >

            {banners.map(banner => (
              <SwiperItem key={banner.position}>
                <Image
                  className='swiper-item'
                  src={banner.banner_image_url}
                  onClick={() => this.travelTo(banner)}
                />
              </SwiperItem>
            ))}
          </Swiper>
        )}

        {events.map(event => (
          <View
            key={event.id}
            className='sku-card'
            onClick={() => this.toDetail(event.event.id)}
          >
            <View className='head-image' style={{ backgroundImage: `url(${event.event?.image_url})` }} >
              {event.tags?.map(tag => (
                <View className='tag' key={tag} >
                  {tag}
                </View>
              ))}
            </View>
            <View className='sku-desc' >
              <View className='title' >
                {event.title}
              </View>
              <View className='time' >
                {event.event.time_desc}
              </View>
              <View className='desc' >
                {event.subtitle}
              </View>
            </View>
          </View>
        ))}

        <NavigatorFixed selected={1} onClick={this.clickNavigatorEventTracking} />
      </View>
    )
  }
}
