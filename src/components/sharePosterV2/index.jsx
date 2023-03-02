import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Canvas, Image } from '@tarojs/components'
import './index.less'

export default class SharePoster extends Component {

  state = {
    canvasWidth: 600,
    canvasHeight: 1044,
    imgHeight: 800,
  }

  componentDidMount() {
    const { canvasWidth } = this.state
    const { data: { summary_image_url } } = this.props
    Taro.getImageInfo({ src: summary_image_url })
      .then(res => {
        const imgHeight = res.height * 2 / (res.width * 2 / canvasWidth)
        this.setState(
          { canvasHeight: imgHeight + 240, imgHeight },
          () => this.draw()
        )
      })
    // this.draw()
  }

  draw = async () => {
    const { canvasWidth, canvasHeight, imgHeight } = this.state
    const { data: { summary_image_url, qr_code_url } } = this.props
    await Taro.showLoading({ title: '海报生成中', mask: true });
    var ctx = Taro.createCanvasContext('shareCanvas', this.$scope)
    ctx.fillStyle = '#FCF1C8';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, 0, 0);

    // 上半区
    if (summary_image_url) {
      await Taro.getImageInfo({ src: summary_image_url })
        .then(res => {
          ctx.drawImage(res.path, 0, 0, canvasWidth, imgHeight);
          ctx.restore()
          ctx.save();
          ctx.draw(true, () => {
            this.saveImage()
          })
        })
    }

    // 二维码
    if (qr_code_url) {
      await Taro.getImageInfo({ src: qr_code_url })
        .then(res => {
          ctx.drawImage(res.path, 112, imgHeight + 52, 144, 144);
          ctx.restore()
          ctx.save();
          ctx.draw(true, () => {
            this.saveImage()
          })
        })
    }

    ctx.font = 'normal 500 22px PingFang SC'
    ctx.setFillStyle('#17505C')   //  颜色
    let desc1 = '我刚刚做了一个';
    ctx.fillText(desc1, 288, imgHeight + 90);
    let desc2 = '有趣的养育测试，';
    ctx.fillText(desc2, 288, imgHeight + 130);
    let desc3 = '你也来一起测测吧。';
    ctx.fillText(desc3, 288, imgHeight + 170);
    ctx.draw(true, () => {
      this.saveImage()
    })

    await Taro.hideLoading()
  }

  // 图片保存
  saveImage() {
    let that = this;
    const { canvasWidth, canvasHeight } = this.state
    Taro.canvasToTempFilePath({
      width: canvasWidth,
      height: canvasHeight,
      destWidth: canvasWidth,
      destHeight: canvasHeight,
      x: 0,
      y: 0,
      canvasId: 'shareCanvas',
      success: function (res) {
        that.setState({
          posterImage: res.tempFilePath,
        })
      }
    }, that.$scope)
  }

  // 点击保存
  handleSave = () => {
    this.getSetting().then(res => {
      if (res) {
        this._saveImageToPhotosAlbum()
      } else {
        Taro.showToast({
          title: '授权失败',
          icon: 'error'
        })
        this.props.onHide()
      }
    })
  }

  // 调用保存至相处API
  _saveImageToPhotosAlbum = () => {
    const { posterImage } = this.state
    const that = this
    Taro.saveImageToPhotosAlbum({
      filePath: posterImage,
      success: function (res) {
        that.props.success()
      }
    })
  }

  // 获取微信相册授权信息
  getSetting() {
    return new Promise((resolve, reject) => {
      Taro.getSetting()
        .then((res) => {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            Taro.authorize({
              scope: 'scope.writePhotosAlbum',
            })
              .then(res => {
                if (res.errMsg == 'authorize:ok') {
                  resolve(true)
                } else {
                  reject(false)
                }
              })
              .catch(() => {
                reject(false)
              })
          } else {
            resolve(true)
          }
        })
        .catch(() => {
          reject(false)
        })
    })
  }

  render() {
    const { canvasWidth, canvasHeight, posterImage } = this.state
    return (
      <View
        className='share-poster'
        onClick={this.props.onHide}
      >
        <View
          className='poster-wrap'
          onClick={(e) => { e.stopPropagation() }}
        >
          <Image className='poster' src={posterImage} mode='widthFix' />
        </View>

        <View
          className='btn'
          onClick={(e) => { e.stopPropagation(); this.handleSave() }}
        >
          保存到相册
        </View>
        <Canvas className='canvas' canvasId='shareCanvas' style={{ width: canvasWidth + 'px', height: canvasHeight + 'px' }}></Canvas>

      </View>
    )
  }
}
