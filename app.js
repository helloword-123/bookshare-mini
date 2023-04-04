// app.js
import Notify from '@vant/weapp/notify/notify';

const ip = '127.0.0.1'

App({
  
  /**
   * 封装wx.request请求
   * method： 请求方式
   * url: 请求地址
   * data： 要传递的参数
   * callback： 请求成功回调函数
   * errFun： 请求失败回调函数
   **/
  asyncRequest(method, url, data) {
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        method: method,
        data: data,
        header: {
          // 'content-type': method == 'GET'?'application/json':'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          // 请求需要带上token
          'token': wx.getStorageSync('header_token')
        },
        dataType: 'json',
        success: function (res) {
          // 1. 统一拦截权限不足
          if (res.data.status == 403) {
            wx.showModal({
              title: '错误',
              content: '权限不足',
              showCancel: false,
              success(res) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
            return;
          }
          // 2. 统一拦截错误
          if(res.data.code === 20001){
            wx.showModal({
              title: '错误',
              content: res.data.message,
              showCancel: false,
              success(res) {
                
              }
            })
            return;
          }
          resolve(res.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
  },

  /**
   * Get请求拼接url和请求参数
   * @param {*} url url
   * @param {*} params 参数
   */
  addParamsToUrl(url, params) {
    let str = "?";
    Object.keys(params).forEach((item) => {
      str += `${item}=${params[item]}&`;
    });
    str = str.slice(0, -1);
    return url + str;
  },

  /**
   * 转换时间格式
   * @param {*} inputTime 输入时间
   */
  formatDate: function (inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  clickMsgNotify(){
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },

  // 小程序收到服务器消息通知
  receiveMsg: function (res) {
    console.log("receiveMsg>> ", res);
    Notify({ type: 'success', message: '你有新的消息！', color: '#323535', background: '#ffffff', onClick: this.clickMsgNotify});
  },

  // 小程序信息
  appInfo: {
    appid: "wx64e73796f64380c0",
    secret: "64f86e32405825b44feaa222e0bce6f7"
  },
  // 全局信息
  globalData: {
    // 用户信息
    userinfo: {
      avatarUrl: "https://edu-wuhaojie.oss-cn-shenzhen.aliyuncs.com/bookshare/2023/01/20/d6a8453705584563b112e28beda766cfG1jZ02UyzoQE056c6edcd4ccc3e544d636fbed23d0fe.jpeg",
      id: 1,
      nickName: "Pluto",
      phone: "18888888888",
      roles: ['super_admin', 'admin', 'user'],
      isAuth: true
    },
    openid: '"oQAtH5TBXXq45UAa22fC6_uY70jA"',
    baseurl: `http://${ip}:8080/`,
    websocketUrl: `ws://${ip}:8080/websocket/`
  },
  // 腾讯地图根据经纬度获取位置的apikey
  mapApiKey: 'OWTBZ-ZK4KJ-FXFFZ-FIHPE-EMT4E-U6FI3',
  location: '',
  lat: 0,
  lng: 0
})