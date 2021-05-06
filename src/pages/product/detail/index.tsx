import { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import {View, Image, RichText, Swiper, SwiperItem} from '@tarojs/components'
import {inject, observer} from 'mobx-react'
import {AtInput} from 'taro-ui'
import {ISimpleProduct, IProductDetail} from '@/interfaces/product'
import {IProductStore} from '@/stores/productStore'
import './index.less'

@inject('productStore')
@observer
export default class Detail extends Component {
    // eslint-disable-next-line react/sort-comp
    productId: number
    constructor(props) {
        super(props)
        this.productId = 0
    }
    get inject() {
        return this.props.productStore as IProductStore
    }
    componentDidMount() {
        this.productId = parseInt(getCurrentInstance()!.router!.params.product_id!)
        
        if(!this.inject.productData.get(this.productId)) {
            this.inject.fetchProductDetail(this.productId)
        }
    }

    // 修改库存
    handleStockSubmit = (sku, oldStock) => {

        return (value) => {
            // console.log('库存',sku,oldStock, value)
            if(oldStock === value) {
                return false
            }

            this.inject.setProductStock(this.productId, sku, value).then(() => {
                Taro.showToast({title: '库存修改成功！', icon: 'none'})
            })
        }
    }
    render() {
        const detail = this.inject.productDetailData
        let productInfo: ISimpleProduct
        // console.log(detail)
        
        if(detail.product_id === 0) {
            return null
        }else {
            productInfo = this.inject.productData.get(detail.product_id)
        }

        const { images, shop_comment, content, stock_lists } = detail as IProductDetail
        const { thumb='', title='', sub_title='' } = productInfo
        return (
            <View>
                <View className='productPage'>
                    <View className='productSwiperWrap'>
                        <Swiper className='productSwiper' indicatorActiveColor='#FFFFFF' indicatorDots autoplay>
                        {images ?
                            images.map((img, index) =>
                            <SwiperItem key={index}>
                                <View className='productImage'>
                                    <Image mode='aspectFill' className='image' src={img} />
                                </View>
                            </SwiperItem>)
                            :
                            <SwiperItem>
                                <View className='productImage'>
                                    <Image mode='aspectFill' className='image' src={thumb} />
                                </View>
                            </SwiperItem>
                        }
                        </Swiper>
                    </View>
                    <View className='productInfoWrap'>
                        <View className='infoName'>{title}</View>
                        <View className='infoDesc'>{sub_title}</View>
                        <View className='infoComment'>{shop_comment}</View>
                    </View>
                    <View className='stockWrap'>
                        {stock_lists.map((item, index) => {
                            // 注意：AtIput里的name一定要是不同的，不然会导致函数传参都是一样的
                            const name = `stockNum${index}`
                            return (<View key={index} className='skuItem'>
                                <View className='name'>{item.name}</View>
                                <View className='stockNum'>
                                <AtInput
                                  name={name}
                                  title='库存'
                                  type='number'
                                  data-num={item.number}
                                  cursor={item.number.toString().length}
                                  value={item.number}
                                  onChange={val => val}
                                  onConfirm={this.handleStockSubmit(item.product_sku, item.number)}
                                  onBlur={this.handleStockSubmit(item.product_sku, item.number)}
                                />
                                </View>
                            </View>
                            )}
                        )}
                    </View>
                    <View className='productDetailWrap'>
                        <View className='text'>—— 详情 ——</View>
                        <View className='content'>
                        <RichText nodes={content} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}
