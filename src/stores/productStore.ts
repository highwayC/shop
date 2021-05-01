import {observable, ObservableMap, action, runInAction, computed, decorate} from 'mobx'
import {ILiProductInfo, IProductDetail} from '@/interfaces/product'
import mockPromise from '@/utils/mockPromise'
import shopService from '@/services/shopService'

/**
 * 产品数据
 */
export interface IProductStore {
    // 产品数据源  Map<key, value>
    productData: Map<number, ILiProductInfo>

    // 列表页面数据
    productListData: {
        ids: number[]
        page: number
        num: number
        count: number
    }

    // 列表数据是否已经请求完
    listIsEnd: boolean

    // 产品详情
    productDetailData: IProductDetail | { product_id: number }

    // 获取产品数据 默认请求第一页20条数据
    fetchProductData: (params?: {page: number; num?: number}) => Promise<any>

    // 获取产品详情
    fetchProductDetail: (product_id: number) => Promise<void>

    // 设置商品上下架
    setProductStatus: (productId: number, status: 1 | 2) => Promise<any>

    // 设置商品库存
    setProductStock: (productId: number, sku: string, stock: number) =>Promise<void>
}

class ProductStore implements IProductStore {
    // observable.map 对象上只有初始化时便存在的属性会转换成可观察的，尽管新添加的属性可以通过使用 extendObservable 转换成可观察的。
    productData: ObservableMap<number, ILiProductInfo> = observable.map({}, {deep: false})

    @observable productListData = {
        ids: [] as number[],
        page: 1,
        num: 0,
        count: 0
    }

    @computed get listIsEnd() {
        if(this.productListData.ids.length <= 0) {
            return false
        }

        return this.productListData.ids.length < this.productListData.page * 20
    }

    @action 
    async fetchProductData(params: {page: number; num?: number} = {page: 1}) {
        // 加入默认参数
        const reqParams = Object.assign({num: 20}, params)

        // 模拟异步返回数据
        const resData = await mockPromise({
            lists: [
                {
                    price: 2500, // 商口单价，单位分
                    status: 1, // 状态， 1：已上架 2：已下架
                    sub_title: 'Milk Tea Series: Green Milk Tea', // 子标题
                    thumb: 'https://www.leidenglai.com/image/weapp/server/product.jpg',
                    title: '小山绿奶茶', // 标题
                    product_id: 1 // 商品ID
                },
                {
                    price: 28000, // 商口单价，单位分
                    vip_price: 20000, // 商口单价，单位分
                    status: 2, // 状态， 1：已上架 2：已下架
                    sub_title: 'Mellow Latte: Royal No.9 Latte', // 子标题
                    thumb: 'https://www.leidenglai.com/image/weapp/server/product.jpg',
                    title: '皇家九号拿铁', // 标题
                    product_id: 2 // 商品ID
                }
            ]
        })
        const idList = resData.lists.map(item => item.product_id)

        // action只能影响正在运行的函数，而无法影响当前函数调用的异步操作
        // 当异步时可以使用runInAction
        //runInAction有点类似action(fn)()的语法糖，调用后，这个action方法会立刻执行。
        runInAction(() => {
            //merge(values) - 把提供对象的所有项拷贝到Map映射中
            this.productData.merge(
                resData.lists.map(item => {
                    // 不启用装饰器语法，而是利用 MobX 内置的工具 decorate 来对类和对象进行装饰。
                    decorate(item, {status: observable})

                    return [item.product_id, item]
                })
            )

            this.productListData.page = reqParams.page
            this.productListData.num = reqParams.num

            if(reqParams.page === 1) {
                //加载第一页
                this.productListData.ids = idList
            }else {
                // 翻页
                this.productListData.ids.push(...idList)
            }
        })
    }

    //  ref 调节器。它会确保创建 observable 属性时，只追踪引用而不会把它的值转变成 observable 
    @observable.ref productDetailData: any = {product_id: 0}

    @action
    async fetchProductDetail(productId) {
        // 获取后端数据
        const resData = await shopService.fetchProductDetail({product_id: productId})

        // 获取富文本
        const resContentData = await shopService.fetchProductDesc({product_id: productId})

        runInAction(() => {
            // 细粒度的控制observable
            this.productDetailData = decorate(Object.assign(resData, resContentData), {stock_lists: observable})
        })
    }

    @action 
    async setProductStatus(productId: number, status: 1 | 2) {
        try {
            await shopService.setProductSatus({product_id: productId, status})

            runInAction(() => {
                this.productData.get(productId)!.status = status
            })
        }catch(err) {
            console.log('修改失败', err)
        }
    }

    @action
    async setProductStock(productId: number, sku: string, stock: number) {
        await shopService.fetchUpdateSkuStock({ product_id: productId, product_sku: sku, number: stock })

        const stock_lists = this.productDetailData.stock_lists as IProductDetail['stock_lists']
        const index = stock_lists.findIndex(item => item.product_sku === sku)

        runInAction(() => {
            this.productDetailData.stock_lists[index].number = stock
        })
    }

}

export default ProductStore