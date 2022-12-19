// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    modalHidden: true, //是否隐藏对话框
  },
  onLoad() {

  },

  // 对话框-取消按钮事件
  modalBindCancel() {
    this.setData({
      modalHidden: true
    })
  },

  modalBindConfirm() {
    this.setData({
      modalHidden: true
    });
    wx: wx.navigateTo({
      url: '/pages/loginInfoInput/loginInfoInput'
    })
  },

  // 点击登录
  login() {
    wx.login({
      success: res => {
        console.log(res.code);

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // 1.拼接请求url
        var url = app.addParamsToUrl("https://api.weixin.qq.com/sns/jscode2session", {
          appid: app.appInfo.appid,
          secret: app.appInfo.secret,
          js_code: res.code,
          grant_type: "authorization_code"
        });
        console.log(url);
        // 2.发起请求
        app.asyncRequest('GET', url)
          .then(res => {
            app.globalData.userInfo.openid = res.openid;
            app.globalData.userInfo.session_key = res.session_key;
            console.log(app.globalData.userInfo);

          }).catch(err => {
            console.log(err)
          });
      }
    })

    // 登陆成功后，提示用户
    this.setData({
      modalHidden: false
    });
  }
})