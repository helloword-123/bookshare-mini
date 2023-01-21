// pages/borrow/borrow.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: '',

        // 分类级联组件
        fieldNames: {
            text: 'name',
            value: 'id',
            children: 'children',
        },
        options: [],
        showCascader: false,
        fieldValue: '全部',
        cascaderValue: -1,

        // 筛选
        option1: [{
                text: '距离近',
                value: 0,
                detail: {
                    sortColumn: 'distance',
                    sortOrder: 'asc'
                }
            },
            {
                text: '距离远',
                value: 1,
                detail: {
                    sortColumn: 'distance',
                    sortOrder: 'desc'
                }
            }, {
                text: '发布时间近',
                value: 2,
                detail: {
                    sortColumn: 'releaseTime',
                    sortOrder: 'asc'
                }
            },
            {
                text: '发布时间远',
                value: 3,
                detail: {
                    sortColumn: 'releaseTime',
                    sortOrder: 'desc'
                }
            }
        ],
        value1: 0,

        // 图书列表
        list: []
    },

    clickBook(e) {
        const {
            bookid
        } = e.currentTarget.dataset;
        let param = {}
        this.data.list.forEach(book => {
            if (book.bookId == bookid) {
                param = book;
                return;
            }
        })

        wx.navigateTo({
            url: `/pages/bookBorrowDetail/bookBorrowDetail?bookinfo=${JSON.stringify(param)}`,
        })
    },

    changeDropdownItem(e) {
        // 重新加载数据
        this.getListWithCondition();
    },

    getConditons() {
        let params = {};
        params.categoryId = this.data.cascaderValue;
        params.keyword = this.data.searchValue;
        params.latitude = app.lat;
        params.longitude = app.lng;
        this.data.option1.forEach(item => {
            if (item.value == this.data.value1) {
                params.sortColumn = item.detail.sortColumn;
                params.sortOrder = item.detail.sortOrder;
            }
        })

        console.log('params', params);

        return params;
    },

    getListWithCondition() {
        wx.showLoading({
            title: '加载中',
        })
        let params = this.getConditons();

        let url = app.addParamsToUrl(app.globalData.baseurl + 'book/getListWithCondition', params);
        console.log(url);

        app.asyncRequest('GET', url)
            .then(res => {
                console.log(res);
                this.setData({
                    list: res.data.list
                })

                wx.hideLoading({

                })
            })
            .catch(err => {
                wx.hideLoading({
                    fail: (res) => {
                        console.log('加载失败');
                    },
                })
            })
    },

    // 获取一二级图书分类
    getCategoryCascader() {

        app.asyncRequest('GET', app.globalData.baseurl + 'book-category/getCategoryCascader')
            .then(res => {
                console.log(res);
                let arr = [];
                arr.push({
                    id: -1,
                    name: "全部"
                })
                arr.push(...res.data.options)
                this.setData({
                    options: arr
                })
            })
    },

    onClickCascader() {
        this.setData({
            showCascader: true,
        });
    },

    onCloseCascader() {
        this.setData({
            showCascader: false,
        });
    },

    onFinishCascader(e) {
        const {
            selectedOptions,
            value
        } = e.detail;
        const fieldValue = selectedOptions
            .map((option) => option.text || option.name)
            .join('/');
        this.setData({
            fieldValue,
            cascaderValue: value,
            showCascader: false,
        })
        console.log(this.data.fieldValue, this.data.cascaderValue);
        // 重新加载数据
        this.getListWithCondition();
    },

    onSearch() {
        // 重新加载数据
        this.getListWithCondition();
    },

    clickMapSearch() {
        wx.navigateTo({
            url: '/pages/mapSearch/mapSearch',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCategoryCascader();
        this.getListWithCondition();
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