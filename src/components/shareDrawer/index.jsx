import { Component } from 'react'
import { View, CoverView, CoverImage, Button } from '@tarojs/components'
import downIcon from '../../images/down.jpg'
import './index.less'

export default class ShareDrawer extends Component {

  render() {
    const { show, options, showPoster, onHide } = this.props
    return (
      <View className='share-drawer'>
        {show && (
          <CoverView className='share-mask'>
            <CoverView className='share-drawer'>
              <CoverView className='drawer-title-bar'>
                <CoverView className='title-text'>
                  分享
                </CoverView>
                <CoverView className='down-icon' onClick={onHide}>
                  <CoverImage
                    className='icon'
                    src={downIcon}
                  />
                </CoverView>
              </CoverView>
              <CoverView className='divdev'></CoverView>
              <CoverView className='options'>
                {options.map(option => (
                  <CoverView className='option' key={option.type}>
                    {option.type === 'poster' ? (
                      <CoverView
                        className='shaer-btn'
                        onClick={showPoster}
                      >
                        <CoverImage
                          className='icon'
                          src={option.icon}
                        />
                      </CoverView>
                    ) : (
                      <Button
                        data-type={option.type}
                        openType='share'
                        className='shaer-btn'
                      >
                        <CoverImage
                          className='icon'
                          src={option.icon}
                        />
                      </Button>
                    )}
                    <CoverView className='share-text'>
                      {option.text}
                    </CoverView>
                  </CoverView>
                ))}
              </CoverView>
            </CoverView>
          </CoverView>
        )}
      </View>
    )
  }
}
