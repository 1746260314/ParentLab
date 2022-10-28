import Taro from '@tarojs/taro'
import { target } from '../request'
// 微信登录
export default function weChatLogin () {
  Taro.login({
    success: (res) => {
      if (res.code) {
        Taro.request({
          url: target + '/wechat_mp/login',
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (loginRes) {
            const resData = loginRes.data
            if (resData.status = 'success') {
              try {
                Taro.setStorageSync('token', resData.data.login_token)
                Taro.setStorageSync('hasProfile', !resData.data.fill_profile_needed)
              } catch (e) { }
            }
          }
        })
      } else {
        console.log('登录失败，请重试' + res.errMsg)
      }
    }
  })
}