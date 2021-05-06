import Taro, {getCurrentInstance} from '@tarojs/taro'
import hoistStatics from 'hoist-non-react-statics'
import {ComponentClass} from '@/interfaces/common'

/**
 * 页面级登录校验装饰器 反向继承
 * 反向继承允许高阶组件通过this关键词获取 InheritedPage，意味着它可以获取到InheritedPage的 state，props，组件生命周期（component lifecycle）钩子，以及渲染方法（render）。
 * 校验不通过替换为登录页，登录成功回到原页面
 */
export default function wrapUserAuth<T extends ComponentClass> (InheritedPage: T): T {
    class UserAuthPage extends InheritedPage {
        static displayName = InheritedPage.displayName || InheritedPage.name
        static propTypes = InheritedPage.propTypes
        static defaultProps = InheritedPage.defaultProps

        // 当前页面是否登录
        private __isLogin: boolean = false
        // 当前实例
        private router: {path?: string, [key:string]: any} = getCurrentInstance().router!

        componentWillMount() {
            const path = this.router.path || ''
            const token: string = Taro.getStorageSync('access_token')
            
            if(!token) {
                this.__isLogin = false
                Taro.redirectTo({url: '/pages/account/login/index?redirect=' + path})
            }else {
                this.__isLogin = true
            }

            if(super.componentWillMount) {
                super.componentWillMount()
            }
        }

        render() {
            return super.render()
        }
    }

    // 拷贝静态属性 不能让属性丢失
    hoistStatics(UserAuthPage, InheritedPage)

    return UserAuthPage
}