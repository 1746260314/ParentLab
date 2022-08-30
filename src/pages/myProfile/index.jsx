import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import FormItem from '../../components/formItem'
import { PLInput, PLTextarea, RadioTags, RadioBars, PLCheckbox } from '../../components/formElements'
import { radioData1, radioData2, radioData3, radioData4, checkboxData } from '../../utils/formData'
import { getUserProfile, updateUsersWechatInfo, updateUsersProfileInfo } from '../../utils/query'
import { isPhone, isEmail } from '../../utils/util'
import addIcon from '../../images/add_icon.png'
import './index.less'

const defaultChild = { gender: '', age: '' }
export default class MyProfile extends Component {

  state = {
    registerID: Taro.getCurrentInstance().router.params.registerID,
    eventID: Taro.getCurrentInstance().router.params.eventID,
    state: Taro.getCurrentInstance().router.params.state,
    wechat_info: {},
    profile: {},
    children: [defaultChild],
  }

  componentWillMount() { }

  componentDidMount() {
    this._getUserProfile()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  _getUserProfile = async () => {
    const res = await getUserProfile()
    if (res.status === 'success') {
      const { wechat_info, profile: { children, ...other } } = res.data
      this.setState({
        wechat_info,
        profile: other,
        children: children || [defaultChild],
      })
    }
  }

  handleChangeWechatInfo = (e) => {
    const { dataset: { name }, value } = e.target
    this.setState({ wechat_info: { ...this.state.wechat_info, [name]: value } })
    this.setState({ [name + '_error']: value ? '' : '必填项！' })
  }

  handleChangeProfile = (e) => {
    const { dataset: { name }, value } = e.target
    this.setState({ profile: { ...this.state.profile, [name]: value } })
    this.setState({ [name + '_error']: value ? '' : '必填项！' })

    // 校验手机号
    if (name === 'phone') {
      if (!isPhone(value)) {
        this.setState({ phone_error: '请填写正确的手机号' })
      }
    }
    // 校验邮箱
    if (name === 'email') {
      if (!isEmail(value)) {
        this.setState({ email_error: '请填写正确的邮箱' })
      }
    }
  }

  // 添加孩子
  handleAddChild = () => {
    this.setState({ children: [...this.state.children, defaultChild] })
  }

  // 孩子性别
  handleChildGenderChange = (index, value) => {
    if (index === 0) {
      this.setState({ children_error: '' })
    }
    const children = [...this.state.children]
    const child = { ...children[index], gender: value }
    children[index] = child
    this.setState({ children })
  }

  // 孩子年龄
  handleChildAgeInputChange = (e, index) => {
    const children = [...this.state.children]
    let value = e.target.value
    if (value > 18) {
      value = 18
    } else if (value < 0) {
      value = 0
    }
    const child = { ...children[index], age: parseInt(value) }
    children[index] = child
    this.setState({ children })

    if (index === 0 && value) {
      this.setState({ children_error: '' })
    }
  }

  // 单选处理器
  handleRadioChange = (name, value) => {
    this.setState({ profile: { ...this.state.profile, [name]: value } })
    this.setState({ [name + '_error']: '' })
  }

  // 多选处理器
  handleCheckboxChange = value => {
    this.setState({ profile: { ...this.state.profile, join_reason: value.join(';') } })
    this.setState({ join_reason_error: '' })
  }

  submit = async () => {
    const { loading, wechat_info, profile, children } = this.state

    if (loading) {
      return;
    }

    let flag = true
    if (!wechat_info.nickname) {
      this.setState({ nickname_error: '必填项！' })
      flag = false
    }

    for (const i in profile) {
      if (Object.hasOwnProperty.call(profile, i)) {
        if (!profile[i]) {
          this.setState({ [i + '_error']: '必填项！' })
          flag = false
        }
      }
    }

    if (!(children[0].age && children[0].gender)) {
      this.setState({ children_error: '请最少添加一个孩子的信息' })
      flag = false
    }

    if (!flag) {
      Taro.showToast({
        title: '请补全信息',
        icon: 'error',
        duration: 2000
      })
      return
    }

    this.setState({ loading: true })
    const res1 = await updateUsersWechatInfo({ wechat_user: wechat_info })
    const res2 = await updateUsersProfileInfo({ wechat_user_profile: { ...profile, children } })

    if (res1.status === 'success' && res2.status === 'success') {
      Taro.setStorageSync('hasProfile', true)
      this.setState({ loading: false })
      const { state, registerID, eventID } = this.state
      if (registerID) {
        let url = '';
        if (state === 'registered') {
          url = `/pages/questionnaire/index?registerID=${registerID}&eventID=${eventID}`
        } else if (state === 'to_be_interviewed') {
          url = `/pages/register/index?registerID=${registerID}`
        } else if (state === 'to_be_signed') {
          url = `/pages/agreementPreview/index?registerID=${registerID}`
        }
        Taro.navigateTo({ url })
      } else {
        await Taro.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        // await Taro.navigateBack()
      }
    }
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

  render() {
    const { wechat_info, profile, children } = this.state
    return (
      <View className='my-profile'>
        <FormItem
          num='01'
          required
          title='您的姓名'
          error={this.state.name_error}
        >
          <PLInput
            error={this.state.name_error}
            type='text'
            data-name='name'
            placeholder='您有效证件的名字'
            value={profile.name}
            handleChange={this.handleChangeProfile}
          />
        </FormItem>

        <FormItem
          num='02'
          required
          title='您的昵称'
          error={this.state.nickname_error}
        >
          <PLInput
            error={this.state.nickname_error}
            type='nickname'
            data-name='nickname'
            placeholder='您喜欢被我们称呼的方式'
            value={wechat_info.nickname}
            handleChange={this.handleChangeWechatInfo}
          />
        </FormItem>

        <FormItem
          num='03'
          required
          title='您的手机号'
          error={this.state.phone_error}
        >
          <PLInput
            error={this.state.phone_error}
            maxlength={11}
            type='number'
            data-name='phone'
            placeholder='确保在需要的时候，可以第一时间联系到您'
            value={profile.phone}
            handleChange={this.handleChangeProfile}
          />
        </FormItem>

        <FormItem
          num='04'
          required
          title='您的邮箱'
          error={this.state.email_error}
        >
          <PLInput
            error={this.state.email_error}
            type='email'
            data-name='email'
            placeholder='建议填写容易查收的邮箱'
            value={profile.email}
            handleChange={this.handleChangeProfile}
          />
        </FormItem>

        <FormItem
          num='05'
          required
          title='您所在的城市'
          error={this.state.living_city_error}
        >
          <PLInput
            error={this.state.living_city_error}
            type='text'
            data-name='living_city'
            value={profile.living_city}
            handleChange={this.handleChangeProfile}
          />
        </FormItem>

        <FormItem
          num='06'
          required
          title='您孩子的性别'
          error={this.state.children_error}
          ps='（和您长期居住在一起的孩子）'
        >
          {children.map((item, index) => (
            <View className='children' key={index}>
              <View className='title'>
                孩子的性别
              </View>
              <RadioTags
                data={radioData3}
                selected={item.gender}
                onChange={value => this.handleChildGenderChange(index, value)}
              />

              <View className='title' style={{ marginTop: '16px' }}>
                孩子的年龄
              </View>
              <PLInput
                maxlength={2}
                type='number'
                placeholder='请输入'
                value={item.age}
                handleChange={e => this.handleChildAgeInputChange(e, index)}
              />
            </View>
          ))}
          <View
            className='add-btn'
            onClick={this.handleAddChild}
          >
            <Image className='add-icon' src={addIcon} />
            添加孩子
          </View>
        </FormItem>

        <FormItem
          num='07'
          required
          title='您是孩子的'
          error={this.state.kinship_error && '必选项！'}
          ps=''
          subtitle='目前我们只接受孩子的父母申请'
        >
          <RadioTags
            data={radioData4}
            selected={profile.kinship}
            onChange={value => this.handleRadioChange('kinship', value)}
          />
        </FormItem>

        <FormItem
          num='08'
          required
          title='您目前的时间状态'
          error={this.state.idle_state_error && '必选项！'}
        >
          <RadioBars
            data={radioData1}
            selected={profile.idle_state}
            onChange={value => this.handleRadioChange('idle_state', value)}
          />
        </FormItem>

        <FormItem
          num='09'
          required
          title='您的学历'
          error={this.state.education_error && '必选项！'}
          ps='（含正攻读的）'
        >
          <RadioBars
            data={radioData2}
            selected={profile.education}
            onChange={value => this.handleRadioChange('education', value)}
          />
        </FormItem>

        <FormItem
          num='10'
          required
          title='您为什么申请参与此项服务'
          error={this.state.join_reason_error && '必选项！'}
          ps='（可多选）'
        >
          <PLCheckbox
            data={checkboxData}
            selected={profile.join_reason?.split(';') || []}
            onChange={this.handleCheckboxChange}
          />
        </FormItem>

        <FormItem
          num='11'
          required
          title='请您用1～2句话，描述一下您的养育理念'
          error={this.state.parenting_feeling_error}
        >
          <PLTextarea
            error={this.state.parenting_feeling_error}
            type='text'
            data-name='parenting_feeling'
            value={profile.parenting_feeling}
            handleChange={this.handleChangeProfile}
          />
        </FormItem>

        <View
          className='submit-btn-wrap'
          onClick={this.submit}
        >
          <View className='submit-btn'>
            保存
          </View>
        </View>

      </View>
    )
  }
}
