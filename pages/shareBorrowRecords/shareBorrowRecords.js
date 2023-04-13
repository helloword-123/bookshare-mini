// pages/shareBorrowRecords/shareBorrowRecords.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 当前所选tab
        tab_active: 0,
        // tab所有标题
        titles: ['共享', '借阅'],
        // 图书列表
        bookList: []
    },

    // 点击图书
    clickBook(e) {
        const {
            bookid
        } = e.currentTarget.dataset;
        let param = {}
        this.data.bookList[this.data.tab_active].forEach(book => {
            if (book.bookId == bookid) {
                param = book;
                return;
            }
        })
        wx.navigateTo({
            url: `/pages/bookDetail/bookDetail?bookinfo=${JSON.stringify(param)}`,
        })
    },

    // 获取图书列表
    getShareBorrowBookList() {
        app.asyncRequest('GET', app.globalData.baseurl + `book-drift/getShareBorrowBookList/${app.globalData.userinfo.id}`)
            .then(res => {
                // 修改时间格式
                for (var i = 0; i < res.data.bookList.length; ++i) {
                    for (var j = 0; j < res.data.bookList[i].length; ++j) {
                        let book = res.data.bookList[i][j];
                        book.releaseTime = app.formatDate(book.releaseTime);
                        if (book.driftTime != null) {
                            book.driftTime = app.formatDate(book.driftTime);
                        }
                    }
                }
                this.setData({
                    bookList: res.data.bookList
                })
            })
    },

    // 点击tab
    onClickTab(event) {
        console.log(event);
        this.setData({
            tab_active: event.detail.name
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        // 设置tab
        let type = options.type;
        console.log(options);
        if (type != undefined) {
            if (type == 'borrow') {
                this.setData({
                    tab_active: 1
                })
            }
        }
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
        // 获取图书列表
        this.getShareBorrowBookList();
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