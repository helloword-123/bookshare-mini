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
    }, {
      img: '/images/mine/admin.png',
      title: '后台管理',
      id: 7
    }],
    msgNum: 0
  },

  getMsgSize() {
    app.asyncRequest('GET', app.globalData.baseurl + `message/getUnReadMessagesSize/${app.globalData.userinfo.id}`)
      .then(res => {
        console.log(res);
        this.setData({
          msgNum: res.data.msgSize
        })
      })

  },

  clickMsg() {
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },

  clickIcon(e) {
    let id = e.currentTarget.dataset.id;
    if (id == 1) {
      wx.reLaunch({
        url: '/pages/shareBorrowRecords/shareBorrowRecords?type=share',
      })
    } else if (id == 2) {
      wx.reLaunch({
        url: '/pages/shareBorrowRecords/shareBorrowRecords?type=borrow',
      })
    } else if (id == 3) {
      wx.navigateTo({
        url: '/pages/bookCollect/bookCollect',
      })
    } else if (id == 4) {
      wx.showToast({
        title: '功能正在开发中...',
      })
    } else if (id == 5) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    } else if (id == 6) {
      wx.showToast({
        title: '功能正在开发中...',
      })
    } else if (id == 7) {

      wx.navigateTo({
        url: '/pages/admin/admin',
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
    this.setData({
      userinfo: app.globalData.userinfo
    })

    this.getMsgSize();
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