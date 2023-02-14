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
        bookinfo: {},

        showDialog: false,
        modalHidden: true,
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
        // 扫码
        // 调用api扫描ISBN
        wx.scanCode({
            scanType: ['barCode'],
            success: res => {
                console.log(res.result)
                var isbn = res.result;
                if (isbn != this.data.bookinfo.isbn) {
                    wx.showToast({
                        title: 'ISBN码不匹配',
                        icon: 'error'
                    })
                    return;
                }

                // 根据isbn号发起请求
                var apikey = '14778.d240ab28c857b24b46148ca6351116a2.b03531cb33b522960cdb109e88e651bc';
                var url = 'https://api.jike.xyz/situ/book/isbn/' + isbn + '?apikey=' + apikey;
                app.asyncRequest('GET', url)
                    .then(res => {
                        console.log(res);
                        // 借阅
                        app.asyncRequest('POST', app.globalData.baseurl + 'book-drift/borrow', {
                                borrowId: app.globalData.userinfo.id,
                                driftId: this.data.bookinfo.driftId
                            })
                            .then(ret => {
                                
                                // 跳转到首页
                                wx: wx.switchTab({
                                    url: '/pages/home/home'
                                })
                                wx.showToast({
                                    title: '借阅成功',
                                })
                            })
                    })
                    .catch(err => {
                        wx.showToast({
                            title: '借阅失败',
                            icon: 'error'
                        })
                    });
            },
            fail: err => {
                console.log(err);
                wx.showToast({
                    title: '扫码失败',
                    icon: 'error'
                })
            }
        })
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

    // 点击”确定“按钮
    commit() {
        this.setData({
            showDialog: false
        })
    },

    borrowCommit() {
        const {
            bookinfo
        } = this.data
        // 1.检测是否在发布点周围
        if (bookinfo.distance > 50) {
            this.setData({
                showDialog: true
            })
            return;
        }

        // 2.现场扫isbn码（后续可以配合图书庭等硬件）
        this.setData({
            modalHidden: false
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