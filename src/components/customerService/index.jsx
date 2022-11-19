import { Component } from 'react'
import { Button, Image } from '@tarojs/components'
import customerService from '../../images/customer_service.png'
import './index.less'

export default class CustomerService extends Component {

  handleClick = () => {
    const { onClick } = this.props;
    onClick && onClick()
  }
  
  render() {
    return (
      <Button openType='contact' className='customer-service' onClick={this.handleClick} >
        <Image className='icon' src={customerService} />
      </Button>
    )
  }
}
