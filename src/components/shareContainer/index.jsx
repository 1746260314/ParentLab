import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import ShareDrawer  from '../shareDrawer'
import shareIcon from '../../images/share2.png'
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

        <ShareDrawer 
          show={show}
          onHide={this.onHide}
          showPoster={this.showPoster}
          options={options}
        />
      </View>
    )
  }
}
