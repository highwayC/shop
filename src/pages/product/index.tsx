import { Component} from 'react'
import {View, Text, Image} from '@tarojs/components'
import {inject, observer} from 'mobx-react'
import {AtButton} from 'taro-ui'
import  {ILiProductInfo} from '@/interfaces/product'
import {IProductStore} from '@/stores/productStore'
import './index.less'

interface InjectStoreProps {
  productStore: IProductStore
}

@inject('store')
@observer
export default class ProductPage extends Component {
  get inject() {
    return this.props as InjectStoreProps
  }

  componentDidMount() {
    console.log(this.props)
  }

    // 模块className前缀
    private prefixCls: string = 'app-product' 
    render() {
        return (
          <AtButton>kkk</AtButton>
        //   <View className={`${this.prefixCls}__page`}>
        //   {productListData.ids.map(id => {
        //     const data = (productData.get(id) || {}) as ILiProductInfo
        //     const { thumb, title, sub_title, price, vip_price, status } = data

        //     return (
        //       <View key={id} className={`${this.prefixCls}__card`}>
        //         <View className={`${this.prefixCls}__img-wrap`} onClick={this.handleNavToDetail.bind(this, id)}>
        //           <Image mode='aspectFill' src={thumb} className={`${this.prefixCls}__img-cont`} />
        //         </View>
        //         <View className={`${this.prefixCls}__cont-wrap`}>
        //           <View className={`${this.prefixCls}__info-wrap`} onClick={this.handleNavToDetail.bind(this, id)}>
        //             <View className={`${this.prefixCls}__info-title`}>{title}</View>
        //             <View className={`${this.prefixCls}__info-text`}>{sub_title}</View>
        //           </View>
        //           <View className={`${this.prefixCls}__bottom`}>
        //             <View className={`${this.prefixCls}__bottom-left`}>
        //               <View className='price'>￥{transformPrice(price, false)}</View>
        //               <Text className='vip-price'>{vip_price > 0 ? `￥${transformPrice(vip_price, false)}` : ''}</Text>
        //               {vip_price > 0 && <Text className='icon iconVip' />}
        //             </View>
        //             <View className={`${this.prefixCls}__action-wrap`}>
        //               {status === 1 ?
        //                 <AtButton onClick={this.handleProductStatus.bind(this, id, 2)} className={`${this.prefixCls}__btn`}>
        //                   下架
        //                 </AtButton>
        //                 :
        //                 <AtButton type='primary' onClick={this.handleProductStatus.bind(this, id, 1)} className={`${this.prefixCls}__btn`}>
        //                   上架
        //                 </AtButton>
        //               }
        //             </View>
        //           </View>
        //         </View>
        //       </View>
        //     )
        //   })}
        // </View>
      )
    }
}
