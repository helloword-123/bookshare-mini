// app.js
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
    // console.log("token " + wx.getStorageSync('header_token'));
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
          resolve(res.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
  },

  addParamsToUrl(url, params) {
    let str = "?";
    Object.keys(params).forEach((item) => {
      str += `${item}=${params[item]}&`;
    });
    str = str.slice(0, -1);
    return url + str;
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  // 小程序信息
  appInfo: {
    appid: "wx64e73796f64380c0",
    secret: "64f86e32405825b44feaa222e0bce6f7"
  },
  globalData: {
    userinfo: null,
    openid:'',
    baseurl: "http://127.0.0.1:8080/"
  },
  // 腾讯地图根据经纬度获取位置的apikey
  mapApiKey: 'OWTBZ-ZK4KJ-FXFFZ-FIHPE-EMT4E-U6FI3',
  location: '111',
  lat: 0,
  lng: 0
})