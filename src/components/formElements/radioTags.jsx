import { Component } from 'react'
import { View } from '@tarojs/components'
import './index.less'

export default class RadioTags extends Component {

  render() {
    const { data, selected } = this.props
    return (
      <View className='radio-tag'>
        {data.map((item, index) => (
          <View
            className={`tag${item === selected ? '-active' : ''}`}
            key={index}
            onClick={() => this.props.onChange(item)}
          >
            {item}
          </View>
        ))}
      </View>
    )
  }
}
