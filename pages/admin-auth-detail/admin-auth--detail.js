// pages/admin-auth-detail/admin-auth--detail.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        auth:{},
        imgList:["/images/mine/icon2.png","/images/mine/icon2.png","/images/mine/icon2.png"],
        content:''
    },

    preView(e) {
        let currentUrl = e.currentTarget.dataset.src
        wx.previewImage({
            current: currentUrl, // 当前显示图片的http链接
            urls: this.data.imgList // 需要预览的图片http链接列表
        })
    },

    getAuthInfo(userId) {
        app.asyncRequest('GET', app.globalData.baseurl + `campus-staff-auth/getAuthInfo/${userId}`)
            .then(res=>{
                this.setData({
                    auth: res.data.campusStaffAuth
                })
                this.setData({
                    ['auth.createTime']: app.formatDate(this.data.auth.createTime)
                })

                return this.getAuthImgListByAuthId();
            })
    },

    getAuthImgListByAuthId() {
        app.asyncRequest('GET', app.globalData.baseurl + `auth-picture/getAuthImgList/${this.data.auth.id}`)
            .then(res=>{
                this.setData({
                    imgList: res.data.imgList
                })
            })
    },

    saveCheckData(e) {
        let status = e.currentTarget.dataset.type;

        app.asyncRequest('POST', app.globalData.baseurl + `campus-staff-auth/check`,{
            id: this.data.auth.id,
            description: this.data.content,
            checkerId: app.globalData.userinfo.id,
            status
        })
            .then(res=>{
                console.log(res);
                if(res.code == 20000){
                    wx.showToast({
                        title: '提交成功',
                        duration: 1000
                    })
                    wx.navigateBack({
                      delta: 1,
                    })
                } else{
                    wx.showToast({
                        title: '提交出错',
                        duration: 1000
                    })
                }
                
            })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAuthInfo(options.userId);
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