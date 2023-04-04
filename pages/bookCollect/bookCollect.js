// pages/bookCollect/bookCollect.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 图书列表
        bookList: []
    },

    // 点击图书
    clickBook(e) {
        const {
            bookid
        } = e.currentTarget.dataset;
        let param = {}
        this.data.bookList.forEach(book => {
            if (book.bookId == bookid) {
                param = book;
                return;
            }
        })
        wx.navigateTo({
            url: `/pages/bookDetail/bookDetail?bookinfo=${JSON.stringify(param)}`,
        })
    },

    // 获取收藏图书列表
    getCollectedBookList() {
        app.asyncRequest('GET', app.globalData.baseurl + `book-collect/getCollectedBooks/${app.globalData.userinfo.id}`)
            .then(res => {
                // 修改时间格式
                for (var j = 0; j < res.data.bookList.length; ++j) {
                    let book = res.data.bookList[j];
                    book.releaseTime = app.formatDate(book.releaseTime);
                    if (book.driftTime != null) {
                        book.driftTime = app.formatDate(book.driftTime);
                    }
                }
                this.setData({
                    bookList: res.data.bookList
                })
            })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCollectedBookList();
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