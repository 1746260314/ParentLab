import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import './index.less'

const imageArr = [
  'https://great-parenting-backend.oss-cn-hangzhou.aliyuncs.com/Parent%20lab%E9%A1%B9%E7%9B%AE%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE-01.png',
  'https://great-parenting-backend.oss-cn-hangzhou.aliyuncs.com/Parent%20lab%E9%A1%B9%E7%9B%AE%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE-02.png',
  'https://great-parenting-backend.oss-cn-hangzhou.aliyuncs.com/Parent%20lab%E9%A1%B9%E7%9B%AE%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE-03.png',
  'https://great-parenting-backend.oss-cn-hangzhou.aliyuncs.com/Parent%20lab%E9%A1%B9%E7%9B%AE%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE-04.png',
  'https://great-parenting-backend.oss-cn-hangzhou.aliyuncs.com/Parent%20lab%E9%A1%B9%E7%9B%AE%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE-05.png',
  'https://great-parenting-backend.oss-cn-hangzhou.aliyuncs.com/Parent%20lab%E9%A1%B9%E7%9B%AE%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE-06.png'
]
export default class AgreementPreview extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
  }

  componentWillMount() { }

  componentDidMount() {

    // Taro.downloadFile({
    //   url: 'https://great-parenting-backend-test.oss-cn-hangzhou.aliyuncs.com/Parent%20lab%E9%A1%B9%E7%9B%AE%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE.pdf',
    //   success: function (res) {
    //     var filePath = res.tempFilePath
    //     Taro.openDocument({
    //       filePath: filePath,
    //       success: function (res) {
    //         console.log('打开文档成功')
    //       }
    //     })
    //   }
    // })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleStart = () => {
    Taro.redirectTo({ url: `/pages/ratifyAccord/index?registerID=${this.state.registerID}` })
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
      <View className='agreement-preview'>

        <View className='preview'>
          {imageArr.map((img, index) => (
            <Image className='file-img' key={index} src={img} />)
          )}
        </View>

        <View className='submit-btn-wrap'>
          <View
            className='submit-btn'
            onClick={this.handleStart}
          >
            开始签署
          </View>
        </View>

      </View>
    )
  }
}
