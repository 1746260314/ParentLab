import { Component } from 'react'
import { View } from '@tarojs/components'
import './index.less'

export default class RadioBars2 extends Component {

  render() {
    const { data, selected } = this.props
    return (
      <View className='radio-bars'>
        {data.map(item => (
          <View
            className={`tag${item.id === selected ? '-active' : ''}`}
            key={item.id}
            onClick={() => this.props.onChange(item)}
          >
            {item.title}
          </View>
        ))}
      </View>
    )
  }
}
