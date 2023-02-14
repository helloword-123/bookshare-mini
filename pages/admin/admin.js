// pages/admin/admin.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        icons: [{
            img: '/images/mine/icon1.png',
            title: '认证管理',
            id: 1
          }, {
            img: '/images/mine/icon2.png',
            title: '图书管理',
            id: 2
          }, {
            img: '/images/mine/icon3.png',
            title: '用户管理',
            id: 3
          }]
    },

    clickIcon(e) {
        let id = e.currentTarget.dataset.id;
        if (id == 1) {
          wx.navigateTo({
            url: '/pages/admin-auth/admin-auth',
          })
        }
        else{
          wx.showToast({
            title: '功能正在开发中...',
          })
        }
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