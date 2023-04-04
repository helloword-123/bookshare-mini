// pages/bookBorrowDetail/bookBorrowDetail.js

const app = getApp();
// 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../../lib/qqmap-wx-jssdk1.2/qqmap-wx-jssdk');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: app.mapApiKey
});

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 图书信息
        bookinfo: {},
        // 是否显示对话框
        showDialog: false,
        // 是否显示modal
        modalHidden: true,
        // 收藏图标
        collectPic: "/images/common/collect.png",
        // 审核内容
        content: ''
    },

    // 保存审核数据
    saveCheckData(e) {
        let status = e.currentTarget.dataset.type;
        app.asyncRequest('POST', app.globalData.baseurl + `book-drift/checkBook`, {
                id: this.data.bookinfo.driftId,
                checkerReply: this.data.content,
                checkerId: app.globalData.userinfo.id,
                status
            })
            .then(res => {
                wx.showModal({
                    title: '提示',
                    content: '提交成功',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    }
                })
            })
    },

    // 获取是否收藏
    getBookCollectByIds() {
        app.asyncRequest('GET', app.globalData.baseurl + `book-collect/getBookCollectByIds/${this.data.bookinfo.bookId}/${app.globalData.userinfo.id}`)
            .then(res => {
                console.log(res);
                if (res.data.code == 1) {
                    this.setData({
                        collectPic: "/images/common/collect_selected.png"
                    })
                } else {
                    this.setData({
                        collectPic: "/images/common/collect.png"
                    })
                }
            })
    },

    // 点击收藏
    clickCollectPic() {
        app.asyncRequest('GET', app.globalData.baseurl + `book-collect/update/${this.data.bookinfo.bookId}/${app.globalData.userinfo.id}`)
            .then(res => {
                console.log(res);
                if (res.data.code == 1) {
                    wx.showToast({
                        title: '收藏成功',
                    })
                    this.setData({
                        collectPic: "/images/common/collect_selected.png"
                    })
                } else {
                    wx.showToast({
                        title: '取消收藏',
                    })
                    this.setData({
                        collectPic: "/images/common/collect.png"
                    })
                }
            })
    },

    // 获取图书分类全名
    getCategoryFullName(categoryId) {
        app.asyncRequest('GET', app.globalData.baseurl + `book-category/getCategoryFullName/${categoryId}`)
            .then(res => {
                this.setData({
                    ['bookinfo.categoryFullName']: res.data.categoryFullName
                })
                console.log(this.data.bookinfo);
            })
    },

    // 计算距离
    calculateDistance() {
        qqmapsdk.calculateDistance({
            to: [{
                latitude: this.data.bookinfo.latitude,
                longitude: this.data.bookinfo.longitude
            }],
            success: res => {
                this.setData({
                    ['bookinfo.distance']: res.result.elements[0].distance
                })
            }
        })
    },

    // 预览图片
    preView(e) {
        let currentUrl = e.currentTarget.dataset.src
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: this.data.bookinfo.imgList // 需要预览的图片http链接列表
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 设置图书信息
        this.setData({
            bookinfo: JSON.parse(options.bookinfo)
        })
        // 计算距离
        this.calculateDistance();
        // 获取图书分类全名
        this.getCategoryFullName(this.data.bookinfo.categoryId);
        // 设置发布时间
        this.setData({
            ['bookinfo.releaseTime']: app.formatDate(this.data.bookinfo.releaseTime)
        })
        // 获取是否收藏
        this.getBookCollectByIds();
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