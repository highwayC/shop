import {observable, ObservableMap, action, runInAction} from 'mobx'
import shopService from '@/services/shopService'
import {ISalesData, ISalesType} from '@/interfaces/dashborad'
import {IPager} from '@/interfaces/common'

const salesType: ISalesType[] = [1, 2, 3, 4]

/*
Partial<T> 可以快速把某个接口类型中定义的属性变成可选的(Optional)
源码：
type Partial<T> = {
    [P in keyof T]?: T[P];
};
*/
// 页面tabs类型数据
type ISalesTabsData = ObservableMap<ISalesType, ISalesData & Partial<IPager>>

/**
 * 统计数据页面
 */
export interface IDashboardStore {
    // 页面数据
    salesTabsData: ISalesTabsData

    // 是否到最后一页
    salesTabsListIsEnd: boolean

    // 获取销售统计数据 type 类型 1:今天 2:昨天 3:前天 4:近七天 默认第一页20条
    fetchSalesData: (type: ISalesType, page?: number) => Promise<void>
}

export default class DashboardStore implements IDashboardStore {
    @observable
    salesTabsListIsEnd = false

    // observable.object参数：1. 需要被观察的对象 2. 对象中的属性哪些需要观察 3. 是否禁用属性值的自动转换
    salesTabsData: ISalesTabsData = observable.map(
        salesType.map(key => [
            key,
            observable.object(
                {
                    total_num: 0,
                    total_money: 0,
                    lists:[] as any[],
                    count: 0
                },
                {},
                {deep: false}
            )
        ]),
        {deep: false}
    )

    @action
    async fetchSalesData(type: ISalesType, page?: number) {
        // 加入默认参数
        const reqParams = Object.assign({num: 20}, {type, page: page || 1})
        const res = await shopService.fetchSalesDataList(reqParams)
        const resData = res.data
        // console.log(type, resData)

        if(reqParams.page === 1) {
            this.salesTabsListIsEnd = false
        }

        runInAction(() => {
            const data = this.salesTabsData.get(type)
            if(data) {
                data.total_num = resData.total_num
                data.total_money = resData.total_money
                data.page = reqParams.page
                
                if(resData.lists!.length === 0) {
                    this.salesTabsListIsEnd = true
                }

                if(reqParams.page === 1) {
                    data.lists = resData.lists
                }else {
                    data.lists.push(...resData.lists)
                }

                this.salesTabsData.set(type, data)
            }
        })
    }
}