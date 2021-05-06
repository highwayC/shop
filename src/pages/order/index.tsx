import { Component } from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {AtButton} from 'taro-ui'
import {View, Text} from '@tarojs/components'
import {inject, observer} from 'mobx-react'
import { IOrderStore } from '@/stores/orderStore'
import { ICommonStore } from '@/stores/commonStore'
import {IOrderDetail} from '@/interfaces/order'
import { IBLEInformation } from '@/interfaces/common'
import transformPrice from '@/utils/transformPrice'
import './index.less'

interface IState {
    isLabelSend: boolean
}

interface InjectStoreProps {
    orderStore: IOrderStore,
    commonStore: ICommonStore
}

@inject('commonStore', 'orderStore')
@observer
export default class Order extends Component {
    constructor(props) {
        super(props)

        // eslint-disable-next-line react/no-unused-state
        this.state = {isLabelSend: false}
        this.instance = getCurrentInstance()

        const list: number[] = []
        const numList:number[] =[]
        let j = 0

        for(let i = 20; i < 200; i += 10) {
            list[j] = i
            j++
        }
        for (let i = 1; i < 10; i++) {
            numList[i - 1] = i
        }

        this.printerData.buffSize = list
        this.printerData.oneTimeData = list[0]
        this.printerData.printNum = numList
        this.printerData.printerNum = numList[0]
    }

    readonly state: IState

    componentWillMount() {
        this.pageType = this.instance.router.params.order_type || 'current'
        
        if(this.pageType === 'current') {
            Taro.setNavigationBarTitle({title:'接单'})
        }else {
            Taro.setNavigationBarTitle({title: '历史订单'})
        }
    }
    componentDidMount() {
        const type = this.pageType === 'current'? 1 : 2

        this.inject.orderStore.fetchOrderData({type})
    }
    // 当前页面状态 current：接单页面 history：历史订单
    private pageType: 'current' | 'history'
    private printerData = {
        buffSize: [] as number[],
        oneTimeData: 0,
        printNum: [] as number[],
        printerNum: 0,
        looptime: 0,
        lastData: 0,
        currentTime: 0,
        currentPrint: 1
    }

    // h5页面 上拉加载更多不触发
    onPullDownRefresh() {
        const type = this.pageType === 'current'? 1 : 2

        this.inject.orderStore.fetchOrderData({type}).then(() => {
            Taro.stopPullDownRefresh()
        })
    }

    // 上拉刷新 h5也没有同步实现
    onReachBottom() {
        const { orderStore: {orderListData, listIsEnd, hisListIsEnd, hisOrderListData }} = this.inject

        // 区分历史订单和接单页面
        const type = this.pageType === 'current'? 1 : 2
        const isEnd = this.pageType === 'current'? listIsEnd : hisListIsEnd
        const page = this.pageType === 'current'? orderListData.page : hisOrderListData.page

        if(!isEnd) {
            // 加载下一页内容
            this.inject.orderStore.fetchOrderData({type, page: page + 1})
        }
    }
    private BLEInformation: IBLEInformation
    private instance: any

    get inject() {
        return this.props as InjectStoreProps
    }

    handlePrintOrder = (data) => {
        return () => {
            console.log(data)
        }
    }

    handlePrintMsg = (data) => {
        return () => {
            console.log(data)
        }
    }

    handleCancelOrder = (orderId: string) => {
        return () => {
            Taro.showModal({
                title: '取消订单',
                content: '你确定要取消本订单吗?',
                success: res => {
                    if(res.confirm) {
                        console.log('点击取消成功！')
                        this.inject.orderStore.cancelOrder(orderId)
                    }else if(res.cancel) {
                        console.log('点击取消成功！')
                    }
                }
            })
        }
    }

    handleMaking = (orderId: string) => {
        return () => {
            this.inject.orderStore.confirmOrder(orderId)
        }
    }

    handleCallPhone = (phoneNumber: string) => {
        return () => {
            Taro.makePhoneCall({phoneNumber})
        }
    }

    render() {
        const {orderStore: {orderData, orderListData, hisOrderListData}} = this.inject
        const listData = this.pageType === 'current'? orderListData: hisOrderListData

        if(listData.ids.length <= 0) {
            return false
        }
        return (
            <View className='orderPage'>
                {listData.ids.map(id => {
                const data = (orderData.get(id) || {}) as IOrderDetail
                const { order_number, sum_money, insert_date, buy_phone, take_number, product_lists, events } = data

                return (
                    <View key={id} className='orderCard'>
                    <View className='cardTop'>
                        <View className='orderItemNo'>{take_number}号</View>
                        <View className='orderDate'>{insert_date}</View>
                        <View className='orderPhone' onClick={this.handleCallPhone(buy_phone)}>
                        {buy_phone}
                        </View>
                    </View>
                    <View className='cardMain'>
                        <View className='orderProduct'>
                        {product_lists.map((item, index) =>
                            <View key={index} className='orderProductItem'>
                            <Text className='name'>{item.title}</Text>
                            <Text className='num'>x{item.num}</Text>
                            <Text className='mark'>{item.standard_text}</Text>
                            </View>)}
                        </View>
                    </View>
                    <View className='cardFooter'>
                        <View className='orderBilling'>
                            <View className='orderPrice'>￥{transformPrice(sum_money)}</View>
                        </View>
                        <View className='orderAction'>
                        {!!~events.indexOf('reprint') &&
                            <AtButton size='small' onClick={this.handlePrintOrder(data)} className='button'>
                            再次打印
                            </AtButton>
                        }
                        {!!~events.indexOf('print') &&
                            <AtButton size='small' onClick={this.handlePrintMsg(data)} className='button green'>
                            打印
                            </AtButton>
                        }
                        {!!~events.indexOf('cancel_payment_order') &&
                            <AtButton size='small' onClick={this.handleCancelOrder(order_number)} className='button'>
                            取消
                            </AtButton>
                        }
                        {!!~events.indexOf('receipt_order') &&
                            <AtButton size='small' onClick={this.handleMaking(order_number)} type='primary' className='button'>
                            开始制作
                            </AtButton>
                        }
                        </View>
                    </View>
                    </View>
                )
                })}
            </View>
        )
    }
}
