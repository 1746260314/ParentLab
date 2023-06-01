import Taro from '@tarojs/taro'
import { updateUsersWechatInfo } from './query'

// 微信登录
export default function getUserWeChatProfile(callback) {
  Taro.getUserInfo({
    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
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
      callback && callback(true)
    },
    fail: (res) => {
      console.log('getUserProfilefail', res)
      callback && callback(false)
    }
  })
}