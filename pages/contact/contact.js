// pages/contact/contact.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 邮件
        email: "446475135@qq.com",
        // 微信号
        weixin: "666666",
        // QQ号
        qq: "446475135"
    },

    // 点击复制
    copy: function (e) {
        let id = e.currentTarget.dataset.id;
        let data = '';
        if (id == 1) {
            data = this.data.email;
        } else if (id == 2) {
            data = this.data.weixin;
        } else if (id == 3) {
            data = this.data.qq;
        }
        wx.setClipboardData({
            data: data,
            success: function (res) {
                
            }
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