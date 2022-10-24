import Taro from '@tarojs/taro'

export const proTarget = 'https://admin.parentlab.cn';
export const dev = 'https://staging-api.parentlab.cn';
export const request = async (url, option = {}) => {
    const params = Object.assign({
        // url: proTarget + url,
        url: dev + url,
        data: {},
        header: {
            'content-type': 'application/json'
        },
        ...option
    })
    try {
        var token = Taro.getStorageSync('token')
        if (token) {
            params.header['Authorization'] = `Bearer ${token}`
        }
    } catch (e) {
        // Do something when catch error
    }
    const res = await Taro.request(params)
    // console.log('success', res)
    if (res.statusCode === 401) {
        Taro.setStorageSync('token', null)
        Taro.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
        })
    } else if (res.statusCode === 400) {
        Taro.showToast({
            title: '服务未响应',
            icon: 'none',
            duration: 2000
        })
    }
    return res.data
}