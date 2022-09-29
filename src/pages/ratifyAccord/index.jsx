import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View } from '@tarojs/components'
import FormItem from '../../components/formItem'
import { PLInput, RadioTags } from '../../components/formElements'
import { radioData6 } from '../../utils/formData'
import { isPhone, isEmail, isIDNum, IDTypeCode, IDCodeType } from '../../utils/util'
import { getUserProfile, submitProtocolUserInfo, getStartSignParams, agreementSigned } from '../../utils/query'
import './index.less'

export default class RatifyAccord extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
    params: {
      customer_name: '',
      address: '',
      id_type: '',
      id_num: '',
      phone_num: '',
      email: ''
    },
  }

  componentWillMount() { }

  componentDidMount() {
    this._getUserProfile()
  }

  componentWillUnmount() { }

  componentDidShow() {
    Taro.onAppShow((options) => {
      console.log('options', options)
      if (typeof options.referrerInfo.extraData != 'undefined') {
        if (options.referrerInfo.extraData.callbackObj.from == 'esign') {
          //如果需要进行跳转的话，可以在这边处理，跳转到自己的小程序某个页面
          this._agreementSigned(this.state.registerID)
        } else {
          Taro.showToast({
            title: '未查询到签署协议',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }

  componentDidHide() { }

  _agreementSigned = async (registerID) => {
    await Taro.showLoading({
      title: '正在查询签署结果',
      mask: true
    })
    const res = await agreementSigned(registerID)
    if (res.status === 'success') {
      await Taro.redirectTo({ url: `/pages/payOrder/index?registerID=${registerID}` })
    } 
    await Taro.hideLoading()
  }

  _getUserProfile = async () => {
    const res = await getUserProfile()
    if (res.status === 'success') {
      const { profile: { name, phone, email } } = res.data
      this.setState({
        params: {
          ...this.state.params,
          customer_name: name,
          phone_num: phone,
          email
        }
      })
    }
  }

  handleInputChange = (e) => {
    const { dataset: { name }, value } = e.target
    this.setState({ params: { ...this.state.params, [name]: value } })
    this.setState({ [name + '_error']: value ? '' : '这是一个必填项！' })

    // 校验手机号
    if (name === 'phone_num') {
      if (!isPhone(value)) {
        this.setState({ phone_num_error: '请填写有效的手机号' })
      }
    }
    // 校验邮箱
    if (name === 'email') {
      if (!isEmail(value)) {
        this.setState({ email_error: '请填写有效的邮箱' })
      }
    }

    // 校验身份证号
    if (name === 'id_num' && this.state.params.id_type === 'CRED_PSN_CH_IDCARD') {
      if (!isIDNum(value)) {
        this.setState({ id_num_error: '请填写有效的身份证号' })
      }
    }
  }

  handleRadioChange = (value) => {
    this.setState({
      params: {
        ...this.state.params,
        id_type: IDTypeCode(value),
        id_num: this.state.params.id_type ? '' : this.state.params.id_num
      },
      id_type_error: false
    })
  }

  submitDisabled = () => {
    const { params } = this.state
    let disable = false
    for (const i in params) {
      if (!params[i]) {
        disable = true
      }
      if (this.state[i + '_error']) {
        disable = true
      }
    }
    return disable
  }

  next = async () => {
    const { params, registerID } = this.state
    if (this.submitDisabled()) return
    Taro.showLoading({
      title: '正在创建协议',
      mask: true
    })
    const res = await submitProtocolUserInfo(params, registerID)
    if (res.status === 'success') {
      await this._getStartSignParams(registerID)
    } else {
      await Taro.hideLoading()
      await Taro.showToast({
        title: '资料提交失败，请重试',
        icon: 'none',
        duration: 2000
      })
    }
  }

  _getStartSignParams = async (registerID) => {
    const res = await getStartSignParams(registerID)
    if (res.status === 'success') {
      Taro.navigateToMiniProgram({
        appId: 'wx1cf2708c2de46337',
        path: '/pages/index/index',
        extraData: {
          requestObj: {
            flowId: res.data.flowId, // 必填，签署流程id
            accountId: res.data.accountId, // 签署必填，账号id
          },
          callbackObj: {
            // 非必填，回传数据：签署完成后会将此数据完整回传
            'from': 'esign',
            registerID: registerID,
          }
        },
        success: function (result) {
          // 打开成功
          console.log('打开成功', result)
        }
      })
    }
    await Taro.hideLoading()
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
    const { params: { customer_name, address, id_type, id_num, phone_num, email } } = this.state
    const disable = this.submitDisabled()
    return (
      <View className='ratify-accord'>

        <FormItem
          title='签署人姓名'
          error={this.state.customer_name_error}
        >
          <PLInput
            error={this.state.customer_name_error}
            type='text'
            data-name='customer_name'
            placeholder='您有效证件的名字'
            value={customer_name}
            handleChange={this.handleInputChange}
          />
        </FormItem>

        <FormItem
          title='居住地址'
          error={this.state.address_error}
        >
          <PLInput
            error={this.state.address_error}
            type='text'
            data-name='address'
            placeholder='请输入'
            value={address}
            handleChange={this.handleInputChange}
          />
        </FormItem>

        <FormItem
          title='证件类型'
          error={this.state.id_type_error && '这是一个必选项！'}
        >
          <RadioTags
            data={radioData6}
            selected={IDCodeType(id_type)}
            onChange={value => this.handleRadioChange(value)}
          />
        </FormItem>

        <FormItem
          title='证件号'
          error={this.state.id_num_error}
        >
          <PLInput
            error={this.state.id_num_error}
            maxlength={18}
            type={id_type === 'CRED_PSN_CH_IDCARD' ? 'idcard' : 'text'}
            data-name='id_num'
            placeholder='请输入'
            value={id_num}
            handleChange={this.handleInputChange}
          />
        </FormItem>


        <FormItem
          title='中国大陆手机号'
          error={this.state.phone_num_error}
        >
          <PLInput
            error={this.state.phone_num_error}
            maxlength={11}
            type='number'
            data-name='phone_num'
            placeholder='请输入'
            value={phone_num}
            handleChange={this.handleInputChange}
          />
        </FormItem>

        <FormItem
          title='电子邮箱'
          error={this.state.email_error}
        >
          <PLInput
            error={this.state.email_error}
            type='email'
            data-name='email'
            placeholder='请输入'
            value={email}
            handleChange={this.handleInputChange}
          />
        </FormItem>

        <View className='powered-by'>
          Powered by 易签宝
        </View>


        <View className='next-btn-wrap'>
          <View
            className={`next-btn ${disable ? 'disable' : ''}`}
            onClick={this.next}
          >
            下一步
          </View>
        </View>

      </View>
    )
  }
}
