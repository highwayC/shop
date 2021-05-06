import { Component } from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtForm, AtInput} from 'taro-ui'
import mockPromise from '@/utils/mockPromise'
import './index.less'

// 当前页面路由参数
interface IRouter {
    redirect?: string
}

interface IState {
    username: string
    password: string
}
export default class Login extends Component {
    readonly state: IState = {
        username: '',
        password: ''
    }
    private router = getCurrentInstance().router

    // 登录
    // 微信小程序端 AtForm上的onSubmit方法无法执行
    handleSubmitLogin = () => {
        const {password, username} = this.state
        console.log(username, password)
        const {redirect} = this.router!.params as IRouter

        // userService.fetchUserLogin({ username, password, os_type: 1 }).then(
        mockPromise({access_token: 'xxxxx'}).then(
            res => {
                // 登陆成功
                Taro.setStorageSync('access_token', res.access_token)

                if(redirect) {
                    // 回到来源页
                    Taro.redirectTo({url: redirect})
                }else {
                    // 跳转到首页
                    Taro.redirectTo({ url: '/pages/index/index' })
                }
            },
            err => {
                // 登录失败
                Taro.showToast({title: err.message, icon: 'none'})
            }
        )
    }

    handleChangeUsername = (value: string) => {
        this.setState({
            username: value
        }) 
    }

    handleChangePassword = (value: string) => {
        this.setState({
            password: value
        })
    }

    render() {
        return (
            <View className='account-login__page'>
                <AtForm>
                    <View className='account-login__input-group'>
                        <View className='account-login__title'>登录</View>
                        <AtInput name='username' type='phone' placeholder='手机号' value={this.state.username} onChange={this.handleChangeUsername} />
                        <AtInput name='password' type='password' placeholder='密码' value={this.state.password} onChange={this.handleChangePassword} />
                    </View>

                    <View className='account-login__action'>
                        <AtButton formType='submit' type='primary' onClick={this.handleSubmitLogin}>登录</AtButton>
                    </View>
                </AtForm>
            </View>
        )
    }
}
