// index.js
var websocket = require('../../utils/websocket') 
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
      fail: res=>{
        console.log(res);
      },
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
            // 连接websocket
            //websocket.ws_connect(app.receiveMsg);
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
      }
    })
  }
})