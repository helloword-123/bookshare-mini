// pages/shareBorrowRecords/shareBorrowRecords.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab_active: 0,
        titles: ['未读消息', '已读消息'],
        messageList: []
    },

    clickMessage(e) {
        const {
            msgId, tab
        } = e.currentTarget.dataset;
        if(tab == 1){
            return
        }
        
        app.asyncRequest('GET', app.globalData.baseurl + `message/readMessage/${app.globalData.userinfo.id}/${msgId}`)
            .then(res => {
                wx.showModal({
                    title: '提示',
                    content: '读取信息完成',
                    showCancel: false,
                    success(res) {

                    }
                })
            })

    },

    getAllMessages() {
        app.asyncRequest('GET', app.globalData.baseurl + `message/getAllMessages/${app.globalData.userinfo.id}`)
            .then(res => {
                console.log(res);
                // 修改时间格式
                for (var i = 0; i < res.data.messageList.length; ++i) {
                    for (var j = 0; j < res.data.messageList[i].length; ++j) {
                        let msg = res.data.messageList[i][j];
                        msg.produceTime = app.formatDate(msg.produceTime);
                    }
                }
                this.setData({
                    messageList: res.data.messageList
                })
            })
    },

    onClickTab(event) {
        this.setData({
            tab_active: event.detail.name
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAllMessages();
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