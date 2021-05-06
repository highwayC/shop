import { Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import {inject, observer} from 'mobx-react'
import {AtButton} from 'taro-ui'
import transformPrice from '@/utils/transformPrice'
import  {ILiProductInfo} from '@/interfaces/product'
import {IProductStore} from '@/stores/productStore'
import './index.less'


@inject('productStore')
@observer
export default class ProductPage extends Component {
  get inject() {
    return this.props.productStore as IProductStore
  }

  componentDidMount() {
    this.inject.fetchProductData()
  }

  handleNavToDetail = (productId: number) => {
    return () => {
      this.inject.fetchProductDetail(productId)
      Taro.navigateTo({url: `/pages/product/detail/index?product_id=${productId}`})
    }
  }

  handleProductStatus = (productId: number, type: 1 | 2) => {
    return () => {
      this.inject.setProductStatus(productId, type)
    }
  }

  // 模块className前缀
  private prefixCls: string = 'app-product' 
  render() {
    // console.log('777',this.inject)
    const {productData, productListData} = this.inject
    if(productListData.ids.length <= 0) {
      return false
    }

    return (
      <View className={`${this.prefixCls}__page`}>
      {productListData.ids.map(id => {
        const data = (productData.get(id) || {}) as ILiProductInfo
        const { thumb, title, sub_title, price, vip_price, status } = data

        return (
          <View key={id} className={`${this.prefixCls}__card`}>
            <View className={`${this.prefixCls}__img-wrap`} onClick={this.handleNavToDetail(id)}>
              <Image mode='aspectFill' src={thumb} className={`${this.prefixCls}__img-cont`} />
            </View>
            <View className={`${this.prefixCls}__cont-wrap`}>
              <View className={`${this.prefixCls}__info-wrap`} onClick={this.handleNavToDetail(id)}>
                <View className={`${this.prefixCls}__info-title`}>{title}</View>
                <View className={`${this.prefixCls}__info-text`}>{sub_title}</View>
              </View>
              <View className={`${this.prefixCls}__bottom`}>
                <View className={`${this.prefixCls}__bottom-left`}>
                  <View className='price'>￥{transformPrice(price, false)}</View>
                  <Text className='vip-price'>{vip_price > 0 ? `￥${transformPrice(vip_price, false)}` : ''}</Text>
                  {vip_price > 0 && <Text className='icon iconVip' />}
                </View>
                <View className={`${this.prefixCls}__action-wrap`}>
                  {status === 1 ?
                    <AtButton onClick={this.handleProductStatus(id, 2)} className={`${this.prefixCls}__btn`}>
                      下架
                    </AtButton>
                    :
                    <AtButton type='primary' onClick={this.handleProductStatus(id, 1)} className={`${this.prefixCls}__btn`}>
                      上架
                    </AtButton>
                  }
                </View>
              </View>
            </View>
          </View>
        )
      })}
    </View>
    )
  }
}
