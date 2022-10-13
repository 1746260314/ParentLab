import { Component } from 'react'
import { View, PageContainer, Text, Image, Button } from '@tarojs/components'
import shareIcon from '../../images/share2.png'
import downIcon from '../../images/down.png'
import './index.less'

export default class ShareContainer extends Component {

  state = {
    show: false
  }

  handleShowDrawer = () => {
    this.setState({ show: true })
  }
  onHide = () => {
    this.setState({ show: false })
  }

  showPoster = () => {
    this.onHide()
    this.props.showPoster()
  }

  render() {
    const { show } = this.state
    const { options } = this.props
    return (
      <View className='share-container'>
        <View
          className='share-btn'
          onClick={this.handleShowDrawer}
        >
          <Image className='icon' src={shareIcon} />
          分享
        </View>

        <PageContainer
          show={show}
          position='bottom'
          round
          onClickOverlay={this.onHide}
        >
          <View className='drawer'>
            <View className='title'>
              <Text>分享</Text>
              <Image
                className='down-icon'
                src={downIcon}
                onClick={this.onHide}
              />
            </View>
            <View className='options'>
              {options.map(option => (
                <View className='option' key={option.type}>
                  {option.type === 'poster' ? (
                    <View 
                      className='shaer-btn'
                      onClick={this.showPoster}
                    >
                      <Image
                        className='icon'
                        src={option.icon}
                      />
                    </View>
                  ) : (
                    <Button
                      data-type={option.type}
                      openType='share'
                      className='shaer-btn'
                    >
                      <Image
                        className='icon'
                        src={option.icon}
                      />
                    </Button>
                  )
                  }

                  <Text className='share-text'>
                    {option.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </PageContainer>

      </View>
    )
  }
}
