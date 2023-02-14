// pages/bookDetail/bookDetail.js

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
        bookinfo: {},
        // 步骤
        active: 0,
        steps: [{
                text: '步骤一',
                desc: '扫ISBN编码',
            },
            {
                text: '步骤二',
                desc: '填写信息',
            }
        ],
        bookDriftSeries: [],
        collectPic: "/images/common/collect.png"
    },

    getBookCollectByIds() {
        app.asyncRequest('GET', app.globalData.baseurl + `book-collect/getBookCollectByIds/${this.data.bookinfo.bookId}/${app.globalData.userinfo.id}`)
            .then(res => {
                console.log(res);
                if (res.data.code == 1) {
                    this.setData({
                        collectPic: "/images/common/collect_selected.png"
                    })
                } else{
                    this.setData({
                        collectPic: "/images/common/collect.png"
                    })
                }
            })
    },

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
                } else{
                    wx.showToast({
                        title: '取消收藏',
                    })
                    this.setData({
                        collectPic: "/images/common/collect.png"
                    })
                } 
            })
    },

    initSteps() {
        app.asyncRequest('GET', app.globalData.baseurl + `book-drift/getBookDriftSeries/${this.data.bookinfo.bookId}`)
            .then(res => {
                for (var i = 0; i < res.data.bookDriftSeries.length; ++i) {
                    var book = res.data.bookDriftSeries[i];
                    book.releaseTime = app.formatDate(book.releaseTime);
                    book.driftTime = app.formatDate(book.driftTime);
                }
                this.setData({
                    bookDriftSeries: res.data.bookDriftSeries,
                    active: res.data.bookDriftSeries.length - 1
                })

                let steps = [];
                for (var i = 0; i < res.data.bookDriftSeries.length; ++i) {
                    var book = res.data.bookDriftSeries[i];
                    let step = {};
                    if (i == 0) {
                        step.text = '共享者';
                        step.desc = `${book.sharer}，发布时间：${book.releaseTime}`
                    } else {
                        step.text = '借阅者';
                        step.desc = `${book.sharer}，借阅时间：${book.driftTime}`
                    }
                    steps.push(step);
                }

                this.setData({
                    steps: steps
                })
            })
    },

    clickStep(e) {
        console.log(e.detail);
    },


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
        this.setData({
            bookinfo: JSON.parse(options.bookinfo)
        })
        this.calculateDistance();
        this.getCategoryFullName(this.data.bookinfo.categoryId);
        this.setData({
            ['bookinfo.releaseTime']: app.formatDate(this.data.bookinfo.releaseTime)
        })

        // 初始化漂流记录数据
        this.initSteps();

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