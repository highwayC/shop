export default {
  pages: [
    'pages/index/index',
    'pages/account/login/index',
    'pages/bluetooth/index',
    'pages/dashboard/index',
    'pages/order/index',
    'pages/order/history/index',
    'pages/product/index',
    'pages/product/detail/index'
  ],
  window: {
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '首页',
    backgroundTextStyle: 'light',
    backgroundColor: '#ffffff'
  },
  debug: true,
  permission: { 'scope.userLocation': { desc: '用于连接蓝牙设备打印票据' }}
}
