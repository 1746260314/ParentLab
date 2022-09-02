import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import NavigatorFixed from '../../components/navigatorFixed'
import CustomerService from '../../components/customerService'
import { getHomepageBanners, getHomepageEvents } from '../../utils/query'
import './index.less'

export default class Index extends Component {

  state = {
    banners: [],
    events: [],
  }

  componentWillMount() { }

  componentDidMount() {
    this._getHomepageBanners()
    this._getHomepageEvents()

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

  travelTo = (url) => {
    console.log(url)
  }

  toDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
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
    const { banners, events } = this.state
    return (
      <View className='index'>
        <CustomerService />
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
                  onClick={() => this.travelTo(banner.target_link)}
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

        <NavigatorFixed selected={1} />
      </View>
    )
  }
}
