import { Component } from 'react'
import { Button, Image } from '@tarojs/components'
import customerService from '../../images/customer_service.png'
import './index.less'

export default class CustomerService extends Component {

  render() {
    return (
      <Button openType='contact' className='customer-service' >
        <Image className='icon' src={customerService} />
      </Button>
    )
  }
}
