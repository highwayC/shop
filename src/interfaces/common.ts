// 请求参数
export interface IReqData {
    // 后端API
    api: string

    // 请求参数
    params?: {[key: string]: any}
    method?: 'POST' | 'GET'
}

// 错误返回
export interface IResError {
    code: number
    message?: string
    data?: any
}