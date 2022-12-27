import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Canvas, Image } from '@tarojs/components'
import './index.less'

export default class SharePoster extends Component {

  state = {
    canvasWidth: 668,
    canvasHeight: 1004,
  }

  componentDidMount() {
    // Taro.getImageInfo({ src: this.props.poster })
    //   .then(res => {
    //     this.setState(
    //       { canvasWidth: res.width, canvasHeight: res.height },
    //       () => this.draw()
    //     )
    //   })

    this.draw()
  }

  draw = async () => {
    const { canvasWidth, canvasHeight } = this.state
    await Taro.showLoading({ title: '海报生成中', mask: true });
    var ctx = Taro.createCanvasContext('shareCanvas', this.$scope)
    ctx.fillStyle = '#FEFBEF';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, 0, 0);
    if (this.props.poster) {
      await Taro.getImageInfo({ src: this.props.poster })
        .then(res => {
          ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight);
          ctx.restore()
          ctx.save();

          ctx.font = 'normal 600 28px PingFang SC'
          ctx.setFillStyle('#17505C')   //  颜色
          let nickname = this.props.inviter.nickname;
          const nicknameWidth = ctx.measureText(nickname).width
          ctx.fillText(nickname, (canvasWidth - nicknameWidth) / 2, 70); //字体加设计高度

          ctx.font = 'normal 500 24px PingFang SC'
          ctx.setFillStyle('#17505C')   //  颜色
          let desc = '您的好友正在邀请你参与测评';
          const descWidth = ctx.measureText(desc).width
          ctx.fillText(desc, (canvasWidth - descWidth) / 2, 108);
          ctx.draw(true, () => {
            this.saveImage()
          })
        })
    }

    // await Taro.getImageInfo({ src: this.props.inviter.headimgurl })
    //   .then(res => {
    //     ctx.arc(28, 525, 12, 0, 2 * Math.PI);
    //     ctx.strokeStyle = '#FD8868'
    //     ctx.lineWidth = '2'
    //     ctx.stroke();
    //     ctx.beginPath();
    //     //圆心x、y的坐标，半径，起始角，结束角，顺时针画
    //     ctx.arc(30, 527, 10, 0, Math.PI * 2)
    //     //将圆形剪切
    //     ctx.clip();
    //     ctx.beginPath();
    //     ctx.drawImage(res.path, 18, 515, 20, 20)
    //     ctx.restore()
    //     ctx.font = 'normal 500 14px PingFang SC'
    //     ctx.setFillStyle('#17505C')   //  颜色
    //     let str = this.props.inviter.nickname
    //     ctx.fillText(str, 48, 530); //字体加设计高度
    //     ctx.draw(true, () => {
    //       this.saveImage()
    //     })
    //   })

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
          posterImage: res.tempFilePath
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
      <View className='share-poster'>
        <View className='poster-wrap'>
          <Image className='poster' src={posterImage} mode='widthFix' />
        </View>

        <View
          className='btn'
          onClick={this.handleSave}
        >
          保存到相册
        </View>
        <Canvas className='canvas' canvasId='shareCanvas' style={{ width: canvasWidth + 'px', height: canvasHeight + 'px' }}></Canvas>
      </View>
    )
  }
}
