// pages/admin-auth/admin-auth.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 为什恶化用户列表
        list:[]
    },

    // 获取未审核用户列表
    getAuthList(){
        app.asyncRequest('GET', app.globalData.baseurl + `campus-staff-auth/getAuthList`)
        .then(res=>{
            this.setData({
                list: res.data.list
            })
        })
    },

    // 点击某一用户
    clickItem(e){
        let userId = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: `/pages/admin-auth-detail/admin-auth--detail?userId=${userId}`,
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
        this.getAuthList();
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