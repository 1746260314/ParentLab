import { Component } from 'react'
import { View } from '@tarojs/components'
import './index.less'

export default class RadioBars extends Component {

  render() {
    const { data, selected } = this.props
    return (
      <View className='radio-bars'>
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
