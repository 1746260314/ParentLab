import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image, PageContainer, Text, Picker } from '@tarojs/components'
import FormItem from '../../components/formItem'
import { PLInput, RadioTags } from '../../components/formElements'
import { radioData3, radioData4 } from '../../utils/formData'
import { getUserChildren, saveUserChildren } from '../../utils/query'
import ConfirmModal from '../../components/confirmModal'
import addIcon from '../../images/add_icon.png'
import downIcon from '../../images/down.png'
import deleteIcon from '../../images/delete.png'
import './index.less'

const defaultChild = { gender: '', age: '', name: '' }
export default class MyChildren extends Component {

  state = {
    assessmentID: Taro.getCurrentInstance().router.params.assessmentID,
    version: Taro.getCurrentInstance().router.params.version,
    needOnboarding: Taro.getCurrentInstance().router.params.needOnboarding,
    kids: [defaultChild],
    kinship: '',
    show: false,
  }

  componentWillMount() { }

  componentDidMount() {
    this._getUserChildren()
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

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

  //获取孩子信息
  _getUserChildren = async () => {
    const res = await getUserChildren()
    if (res.status === 'success') {
      const { kids = [], kinship } = res.data
      if (kids.length === 0) return
      this.setState({
        kids,
        kinship
      })
    }
  }

  // 添加孩子
  handleAddChild = () => {
    this.setState({ kids: [...this.state.kids, defaultChild] })
  }

  // 修改kinship
  handleKinshipChange = (value) => {
    if (value !== '妈妈' && value !== '爸爸') {
      this.setState({ show: true })
    } else {
      this.setState({ kinship: value })
      this.setState({ kinship_error: '' })
    }
  }

  handleOtherKinshipChange = (value) => {
    this.setState({ kinship: value })
    this.setState({ kinship_error: '' })
  }

  // 修改孩子信息
  handleKidInfoChange = (value, index, target) => {
    const kids = [...this.state.kids]
    const kid = { ...kids[index], [target]: value }
    kids[index] = kid
    this.setState({ kids })
  }

  submit = async () => {
    const { loading, kids, kinship, assessmentID, version, needOnboarding } = this.state
    if (loading) return
    const disabled = !kinship || !(kids[0]?.age && kids[0]?.gender && kids[0]?.name)
    if(disabled) return
    this.setState({ loading: true })
    const params = {
      kinship,
      user_kids: kids
    }
    const res = await saveUserChildren(params)
    if (res.status === 'success') {
      this.setState({ loading: false })
      if (assessmentID) {
        let url = ''
        if (needOnboarding) {
          url = `/pages/myChildRearing/index?assessmentID=${assessmentID}&version=${version}`
        } else {
          url = `/pages/${version}/index?assessmentID=${assessmentID}`
        }
        Taro.redirectTo({ url })
      } else {
        await Taro.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        await Taro.navigateBack()
      }
    }
  }

  onShowDrawer = () => {
    this.setState({ show: true })
  }
  onHideDrawer = () => {
    this.setState({ show: false })
  }

  // 点击删除
  onClickDelete = (index) => {
    this.setState({
      targetIndex: index,
      showConfirm: true
    })
  }

  handleCancel = () => {
    this.setState({ showConfirm: false })
  }

  //删除孩子信息
  handleDetailKid = () => {
    const { kids, targetIndex } = this.state
    let newKids = []
    for (let i = 0; i < kids.length; i++) {
      const item = kids[i];
      if (i !== targetIndex) {
        newKids.push(item)
      }
    }
    this.setState({
      kids: newKids,
      showConfirm: false
    })
  }

  render() {
    const { kinship, kids, show, showConfirm } = this.state
    let kinshipOptions = [
      ...radioData4, '其他'
    ]
    if (kinship && kinship !== kinshipOptions[0] && kinship !== kinshipOptions[1]) {
      kinshipOptions[2] = kinship
    }
    const otherKinshipOptions = ['爷爷', '奶奶', '外公', '外婆', '其他养育人']
    const disabled = !kinship || !(kids[0]?.age && kids[0]?.gender && kids[0]?.name)
    
    return (
      <View className='my-children'>
        <FormItem
          // required
          title='您是孩子的'
          error={this.state.kinship_error && '必选项！'}
        >
          <RadioTags
            data={kinshipOptions}
            selected={kinship}
            onChange={this.handleKinshipChange}
          />
        </FormItem>

        <PageContainer
          show={show}
          position='bottom'
          round
          onClickOverlay={this.onHideDrawer}
        >
          <View className='drawer'>
            <View className='title'>
              <Text>我是孩子的</Text>
              <Image
                className='down-icon'
                src={downIcon}
                onClick={this.onHideDrawer}
              />
            </View>

            <RadioTags
              data={otherKinshipOptions}
              selected={kinship}
              onChange={this.handleOtherKinshipChange}
            />
          </View>
        </PageContainer>

        {kids.map((kid, index) => (
          <FormItem key={index}>
            <View className='kid-wrap'>
              <View className='title-bar'>
                我的孩子
                {kids.length > 1 && (
                  <Image
                    className='delete-icon'
                    src={deleteIcon}
                    onClick={() => this.onClickDelete(index)}
                  />
                )}
              </View>
              <View className='kid-container'>

                <View className='title'>
                  孩子的名字
                </View>
                <PLInput
                  type='text'
                  placeholder='请输入'
                  value={kid.name}
                  handleChange={e => this.handleKidInfoChange(e.target.value, index, 'name')}
                />

                <View className='title' style={{ marginTop: '16px' }}>
                  孩子的性别
                </View>
                <RadioTags
                  data={radioData3}
                  selected={kid.gender}
                  onChange={(value) => this.handleKidInfoChange(value, index, 'gender')}
                />
                <View className='title' style={{ marginTop: '16px' }}>
                  孩子的生日
                </View>
                <Picker mode='date' onChange={e => this.handleKidInfoChange(e.target.value, index, 'age')}>
                  <View className='picker'>
                    {kid.age}
                  </View>
                </Picker>
              </View>
            </View>
          </FormItem>
        ))}

        {kids.length < 10 && (
          <View className='add_bar'>
            <View
              className='add-btn'
              onClick={this.handleAddChild}
            >
              <Image className='add-icon' src={addIcon} />
              孩子信息
            </View>
          </View>
        )}

        <View
          className='submit-btn-wrap'
          onClick={this.submit}
        >
          <View className={`submit-btn ${disabled ? 'btn-disabled' : ''}`}>
            保存
          </View>
        </View>

        {showConfirm && (
          <ConfirmModal
            title='删除孩子信息'
            desc={['请确认是否删除您的孩子信息']}
            cancelText='取消'
            saveText='删除'
            onCancel={this.handleCancel}
            onSave={this.handleDetailKid}
          />
        )}

      </View>
    )
  }
}
