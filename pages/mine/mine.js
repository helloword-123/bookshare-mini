// pages/mine/mine.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    icons: [{
      img: '/images/mine/icon1.png',
      title: '共享记录',
      id: 1
    }, {
      img: '/images/mine/icon2.png',
      title: '借阅记录',
      id: 2
    }, {
      img: '/images/mine/icon3.png',
      title: '我的收藏',
      id: 3
    }, {
      img: '/images/mine/icon4.png',
      title: '我的积分',
      id: 4
    }, {
      img: '/images/mine/icon5.png',
      title: '我的认证',
      id: 5
    }, {
      img: '/images/mine/icon6.png',
      title: '会员中心',
      id: 6
    }]
  },

  clickIcon(e) {
    let id = e.currentTarget.dataset.id;
    if (id == 1) {
      wx.reLaunch({
        url: '/pages/shareBorrowRecords/shareBorrowRecords?type=share',
      })
    }
    else if (id == 2) {
      wx.reLaunch({
        url: '/pages/shareBorrowRecords/shareBorrowRecords?type=borrow',
      })
    }
    else if (id == 5) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    }
  },

  clickSetting() {
    wx.navigateTo({
      url: `/pages/userinfo/userinfo?userinfo=${JSON.stringify(app.globalData.userinfo)}`,
    })
  },

  clickAdvice() {
    wx.navigateTo({
      url: '/pages/advice/advice',
    })
  },

  clickHelp() {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },

  clickContact() {
    wx.navigateTo({
      url: '/pages/contact/contact',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userinfo: app.globalData.userinfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})