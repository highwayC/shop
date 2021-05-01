import { Component } from 'react'
import { View, Text, Navigator} from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.less'

export default class Index extends Component {
//  componentWillMount => componentDidMount => onLoad => componentDidShow => onReady
// onready 阶段才可使用createSelectorQuery访问dom节点

  changePage = (url: string) => {
    return () => {
      Taro.navigateTo({url})
    }
  }

  handleLogout = () => {
    // 清除token
    // Taro.removeStorageSync('access_token')

    // 跳转登录页
    Taro.reLaunch({url: '/pages/account/login/index'})
  }

  render () {
    return (
      <View className='index_page'>
        <View className='index_nav-wrap'>
          <View className='index_item-card'>
            <View className='index_card-box' onClick={this.changePage('/pages/product/index')}>
              <Text className='icon iconNavProduct' />
              <View className='title'>我的商品</View>
            </View>
          </View>
          <View className='index_item-card'>
            <View className='index_card-box' onClick={this.changePage('/pages/order/index')}>
              <Text className='icon iconNavOrder' />
              <View className='title'>接单</View>
            </View>
          </View>
          <View className='index_item-card'>
            <View className='index_card-box' onClick={this.changePage('/pages/order/history/index')}>
              <Text className='icon iconNavOrderHis' />
              <View className='title'>历史订单</View>
            </View>
          </View>
          <View className='index_item-card'>
            <View className='index_card-box' onClick={this.changePage('/pages/dashboard/index')}>
              <Text className='icon iconNavDashboard' />
              <View className='title'>统计</View>
            </View>
          </View>
          <View className='index_item-card'>
            <View className='index_card-box' onClick={this.changePage('/pages/bluetooth/index')}>
              <Text className='icon iconNavBlurt' />
              <View className='title'>蓝牙连接</View>
            </View>
          </View>
          <View className='index_item-card'>
            <View className='index_card-box' onClick={this.handleLogout}>
              <Text className='icon iconNavLogout' />
              <View className='title'>退出</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
