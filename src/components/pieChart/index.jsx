import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Canvas } from '@tarojs/components'
import Charts from '../../utils/wxcharts-min.js'
import './index.less'

export default class PieChart extends Component {

  state = {
    chartsData: this.props.data || []
  }

  componentDidMount() {
    let windowWidth = 370;
    try {
      let res = Taro.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      // do something when get system info failed
    }

    this.charts = new Charts({
      canvasId: `canvas${this.props.id}`,
      type: 'pie',
      series: this.state.chartsData,
      width: windowWidth - 80,
      height: 300,
      dataLabel: true,
    });
  }

  touchHandler = (e) => {
    const index = this.charts.getCurrentDataIndex(e)
    const { chartsData } = this.state
    if (index !== -1) {
      // Taro.showModal({
      //   title: '你点击了',
      //   content: chartsData[index].name + '，数值:' + chartsData[index].data
      // })
      this.props.onClick && this.props.onClick(chartsData[index])
    }
  }

  render() {
    return (
      <View className='pie-chart'>
        <Canvas canvasId={`canvas${this.props.id}`} className='pie' onTouchStart={this.touchHandler}></Canvas>
      </View>
    )
  }
}
