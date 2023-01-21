// pages/userinfo/userinfo.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: {
            avatarUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            username: 'Pluto',
            phone: '1888888888',
        },
        isReadonly: [true, true],
        modalHidden: true
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
        app.asyncRequest('GET', app.globalData.baseurl + `user/logout/${this.data.userinfo.id}`)
            .then(res => {
                console.log(res);
                // 清除信息
                app.globalData.userinfo={};
                app.globalData.openid='',
                app.location='',
                app.laat='',
                app.lng=''

                wx.navigateTo({
                  url: '/pages/login/login',
                })
                wx.showToast({
                  title: '退出成功',
                })
            })
    },

    logoutButton() {
        this.setData({
            modalHidden: false
        });
    },

    onChooseAvatar(e) {
        console.log(e);
        const {
            avatarUrl
        } = e.detail
        // 上传头像
        this.uploadFile(avatarUrl);
    },

    // 上传头像
    uploadFile(avatarUrl) {
        wx.uploadFile({
            url: app.globalData.baseurl + 'common/uploadFile', //后台接口
            filePath: avatarUrl, // 上传图片 url
            name: 'image',
            // formData: this.formData,
            header: {
                'content-type': 'multipart/form-data',
                'token': wx.getStorageSync('header_token')
            }, // header 值
            success: res => {
                console.log('上传成功')
                let data = JSON.parse(res.data);
                this.setData({
                    ['userinfo.avatarUrl']: data.data.url
                })
            },
            fail: e => {
                console.log('上传失败')
            }
        });
    },

    saveButton() {
        app.asyncRequest('POST', app.globalData.baseurl + 'user/updateUserInfo', {
                avatarUrl: this.data.userinfo.avatarUrl,
                id: this.data.userinfo.id,
                nickName: this.data.userinfo.nickName,
                phone: this.data.userinfo.phone
            })
            .then(res => {
                console.log(res);
                wx.showToast({
                    title: '修改成功',
                })
            }).catch(err => {
                console.log(err)
            });
    },

    onClickIcon(e) {
        let id = e.currentTarget.dataset.id;
        let arr = this.data.isReadonly;
        arr[id] = !arr[id];
        this.setData({
            isReadonly: arr
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        this.setData({
            userinfo: JSON.parse(options.userinfo)
        })
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