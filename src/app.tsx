import { Component} from 'react'
import {Provider} from 'mobx-react'
import ProductStore from './stores/productStore'
import './assets/style/uiStyle.scss'
import './app.less'

const store = {
  productStore: new ProductStore()
}

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在App类中的render() 函数没有实际作用 请勿修改此函数
  render () {
    return (
      <Provider store ={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App;
