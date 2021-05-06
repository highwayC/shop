import { Component} from 'react'
import {Provider} from 'mobx-react'
import ProductStore from './stores/productStore'
import commonStore from './stores/commonStore'
import orderStore from './stores/orderStore'
import dashboardStore from './stores/dashboardStore'
import './assets/style/uiStyle.scss'
import './app.less'

const store = {
  productStore: new ProductStore(),
  commonStore: new commonStore(),
  orderStore: new orderStore(),
  dashboardStore: new dashboardStore()
}

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在App类中的render() 函数没有实际作用 请勿修改此函数
  render () {
    return (
      <Provider productStore={store.productStore} commonStore={store.commonStore} orderStore={store.orderStore} dashboardStore={store.dashboardStore}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App;
