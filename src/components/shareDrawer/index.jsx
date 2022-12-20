import { Component } from 'react'
import { View, PageContainer, Text, Image, Button } from '@tarojs/components'
import downIcon from '../../images/down.png'
import './index.less'

export default class ShareDrawer extends Component {

  render() {
    const { show, options, showPoster, onHide } = this.props
    return (
      <PageContainer
        show={show}
        position='bottom'
        round
        onClickOverlay={onHide}
      >
        <View className='share-drawer'>
          <View className='title'>
            <Text>分享</Text>
            <Image
              className='down-icon'
              src={downIcon}
              onClick={onHide}
            />
          </View>
          <View className='options'>
            {options.map(option => (
              <View className='option' key={option.type}>
                {option.type === 'poster' ? (
                  <View
                    className='shaer-btn'
                    onClick={showPoster}
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
    )
  }
}
