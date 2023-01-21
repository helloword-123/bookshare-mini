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

  // 小程序信息
  appInfo: {
    appid: "wx64e73796f64380c0",
    secret: "64f86e32405825b44feaa222e0bce6f7"
  },
  globalData: {
    userinfo: {
      avatarUrl: "https://edu-wuhaojie.oss-cn-shenzhen.aliyuncs.com/bookshare/2023/01/20/d6a8453705584563b112e28beda766cfG1jZ02UyzoQE056c6edcd4ccc3e544d636fbed23d0fe.jpeg",
      id: 1,
      nickName: "Pluto",
      phone: "18888888888",
    },
    openid: '"oQAtH5TBXXq45UAa22fC6_uY70jA"',
    baseurl: "http://127.0.0.1:8080/"
  },
  // 腾讯地图根据经纬度获取位置的apikey
  mapApiKey: 'OWTBZ-ZK4KJ-FXFFZ-FIHPE-EMT4E-U6FI3',
  location: '',
  lat: 0,
  lng: 0
})