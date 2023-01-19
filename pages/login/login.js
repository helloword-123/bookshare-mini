// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    modalHidden: true, //是否隐藏对话框
    picurl: "https://edu-wuhaojie.oss-cn-shenzhen.aliyuncs.com/bookshare/2022/12/16/7b3aebe1ed9146b5a53e742343b02611f778738c-e4f8-4870-b634-56703b4acafe.gif"
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
    wx.navigateTo({
      url: '/pages/loginInfoInput/loginInfoInput?nickname=' + app.globalData.userinfo.nickName + "&avatarurl=" + app.globalData.userinfo.avatarUrl
    })
  },

  // 点击登录
  login() {
    wx.showLoading({
      title: '登录中',
    })

    wx.login({
      success: res => {
        console.log("login code is: " + res.code);
        // 发送 res.code 到后台换取token，openid和userinfo
        wx.request({
          url: app.globalData.baseurl + "user/wxLogin",
          method: 'POST',
          data: {
            code: res.code
          },
          success: (ret) => {
            console.log(ret);
            wx.setStorageSync('header_token', ret.data.data.token)
            // console.log(wx.getStorageSync('header_token'))
            app.globalData.userinfo = ret.data.data.userinfo;
            app.globalData.openid = ret.data.data.openid;
            // 登陆成功后，提示用户
            this.setData({
              modalHidden: false
            });
            wx.hideLoading({
              
            })
          },
          fail: ret=>{
            wx.hideLoading({
              fail: (err) => {
                wx.showToast({
                  title: '登录失败',
                })
              },
            })
          }
        })

        

        //   // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //   // 后台处理，不用前台请求
        //   // 1.拼接请求url
        //   var url = app.addParamsToUrl("https://api.weixin.qq.com/sns/jscode2session", {
        //     appid: app.appInfo.appid,
        //     secret: app.appInfo.secret,
        //     js_code: res.code,
        //     grant_type: "authorization_code"
        //   });
        //   console.log(url);
        //   // 2.发起请求
        //   app.asyncRequest('GET', url)
        //     .then(res => {
        //       app.globalData.userInfo.openid = res.openid;
        //       app.globalData.userInfo.session_key = res.session_key;
        //       console.log(app.globalData.userInfo);

        //     }).catch(err => {
        //       console.log(err)
        //     });
      }
    })
  }
})