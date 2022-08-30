import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import uncheckIcon from '../../images/checkbox_uncheck.png'
import selectedIcon from '../../images/checkbox_selected.png'
import './index.less'

export default class PLCheckbox extends Component {

  onClick = (value) => {
    let result = []
    if (this.props.selected.includes(value)) {
      result = this.props.selected.filter(i => i !== value)
    } else {
      result = [...this.props.selected, value]
    }
    this.props.onChange(result)
  }

  render() {
    const { data, selected = [] } = this.props
    return (
      <View className='pl-checkbox'>
        {data.map((item, index) => (
          <View
            className='option'
            key={index}
            onClick={() => this.onClick(item)}
          >
            <View className='option-name'  >
              {item}
            </View>

            <Image className='option-icon' src={selected.includes(item) ? selectedIcon : uncheckIcon} />

          </View>
        ))}
      </View>
    )
  }
}