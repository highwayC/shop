import { Component } from 'react'
import {View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import {inject, observer} from 'mobx-react'
import {AtTabs, AtTabsPane} from 'taro-ui'
import transformPrice from '@/utils/transformPrice'
import { IDashboardStore } from '@/stores/dashboardStore'
import {ISalesData, ISalesType} from '@/interfaces/dashboard'
import './index.less'

interface InjectStoreProps {
    dashboardStore: IDashboardStore
}

interface IState {
    currentTab: number
}

@inject('dashboardStore')
@observer
export default class index extends Component {
    // 兼容注入store
    get inject() {
        return this.props as InjectStoreProps
    }

    readonly state: IState = {currentTab: 0}

    private tabList: {title: string, tabId: ISalesType}[] = [
        {title: '今天', tabId: 1},
        {title: '昨天', tabId: 2},
        {title: '前天', tabId: 3},
        {title: '近七天', tabId: 4}
    ]

    componentDidMount() {
        // 请求初始数据
        this.inject.dashboardStore.fetchSalesData(1)
    }

    handleChangeTab = (value) => {
        const {tabId} = this.tabList[value]

        this.setState({currentTab: value})

        this.inject.dashboardStore.fetchSalesData(tabId)
    }
    render() {
        const {salesTabsData} = this.inject.dashboardStore
        return (
            <View className='dashboardPage'>
                <AtTabs current={this.state.currentTab} swipeable={false} tabList={this.tabList} onClick={this.handleChangeTab}>
                    {this.tabList.map((item, index) => {
                        const tabData = salesTabsData.get(item.tabId) || {}
                        const { total_num, total_money, lists } = tabData as ISalesData

                        return (
                        <AtTabsPane key={item.tabId} current={this.state.currentTab} index={index}>
                            <View className='listWrap'>
                            <View className='topInfo'>
                                共销售{total_num}杯，收入￥{transformPrice(total_money)}
                            </View>
                            <View className='contentList'>
                                {lists &&
                                lists.map((order, index) => {
                                    const { title, standard_text } = order
                                    const orderTotalNum = order.total_num
                                    const orderTotalPrice = transformPrice(order.total_money)
                                    const price = transformPrice(order.price)

                                    return (
                                    <View key={index} className='orderItem'>
                                        <View className='title'>{title}</View>
                                        <View className='info'>
                                        <View className='infoText'>{standard_text}</View>
                                        <View className='infoNum'>X{orderTotalNum}</View>
                                        </View>
                                        <View className='price'>
                                        <View className='left'>￥{price}</View>
                                        <View className='right'>￥{orderTotalPrice}</View>
                                        </View>
                                    </View>
                                    )
                                })}
                            </View>
                        </View>
                    </AtTabsPane>
                    )
                })}
                </AtTabs>
            </View>
        )
    }
}
