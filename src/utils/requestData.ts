import { SERVER_PROTOCOL, SERVER_API_ROOT_API, DEF_REQUEST_CONFIG } from '../config'
import responseHandler from '@/utils/responseHandler'
import {IReqData, IResError} from '@/interfaces/common'
import {request} from '@tarojs/taro'
import {isObservable, toJS} from 'mobx'

/**
 * 请求后端数据封装
 * @return 直接返回data或错误对象
 */
export default function requestData<T = void>({api,params = {}, method = 'GET'}: IReqData) {
    return new Promise<T>((resolve: (data) => void, reject: (err: IResError) => void) => {
        const completeApi = SERVER_PROTOCOL + SERVER_API_ROOT_API + api
        const mergeData = Object.assign({}, DEF_REQUEST_CONFIG, params)
        const requestParams = {}

        for(let key in mergeData) {
            if(isObservable(mergeData[key])) {
                //递归地将一个(observable)对象转换为 javascript 结构
                requestParams[key] = toJS(mergeData[key])
            }else if(typeof mergeData[key] === 'string') {
                requestParams[key] = mergeData[key]
            }else {
                requestParams[key] = mergeData[key]
            }
        }

        const options: {url: string, [key: string]: any} = {
            url: completeApi,
            method,
            header: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: requestParams
        }

        // 发送请求 返回promise对象
        request(options)
            .then(responseHandler)
            .then(resolve)
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}
