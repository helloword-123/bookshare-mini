// pages/userinfo/userinfo.js
const app = getApp();
var websocket = require('../../utils/websocket')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 用户信息
        id: 1,
        // 头像
        avatarUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
        // 昵称
        username: 'Pluto',
        // 手机号
        phone: '1888888888',
        // 昵称和手机号是否只读
        isReadonly: [true, true],
        // 提示框是否显示
        modalHidden: true
    },

    // 对话框-取消按钮事件
    modalBindCancel() {
        this.setData({
            modalHidden: true
        })
    },

    // 对话框-确认按钮事件，退出登录
    modalBindConfirm() {
        this.setData({
            modalHidden: true
        });
        app.asyncRequest('GET', app.globalData.baseurl + `user/logout/${this.data.id}`)
            .then(res => {
                console.log(res);
                // 清除信息
                app.globalData.userinfo = {};
                app.location = '',
                app.lat = '',
                app.lng = ''
                // 断开socket连接
                if (websocket.socketOpen === true) {
                    websocket.onClose();
                }
                // 返回首页
                wx.showModal({
                    title: '信息',
                    content: '退出登录成功',
                    showCancel: false,
                    success(res) {
                        wx.reLaunch({
                            url: '/pages/login/login',
                        })
                    }
                })
            })
    },

    // “退出登录”按钮点击事件
    logoutButton() {
        this.setData({
            modalHidden: false
        });
    },

    // 点击头像
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
                    avatarUrl: data.data.url
                })
            },
            fail: e => {
                console.log('上传失败')
            }
        });
    },

    // 保存信息
    saveButton() {
        // 校验
        let regNickName = /^[\w\u4e00-\u9fa5]{5,18}$/;
        let regPhone = /^1[3578]\d{9}$/;
        // 1. 空判断
        if (this.data.nickName == "") {
            wx.showModal({
                title: '提示',
                content: '昵称不能为空!',
                showCancel: false,
            })
            return false
        }
        if (this.data.phone == "") {
            wx.showModal({
                title: '提示',
                content: '手机号不能为空!',
                showCancel: false,
            })
            return false
        }
        // 2. 格式校验
        // if(!regNickName.test(this.data.nickName)){
        //     wx.showModal({
        //         title: '提示',
        //         content: '昵称格式有误!',
        //         showCancel: false,
        //     })
        //     return false
        // }
        if (!regPhone.test(this.data.phone)) {
            wx.showModal({
                title: '提示',
                content: '手机号格式有误!',
                showCancel: false,
            })
            return false
        }

        app.asyncRequest('POST', app.globalData.baseurl + 'user/updateUserInfo', {
                avatarUrl: this.data.avatarUrl,
                id: this.data.id,
                nickName: this.data.nickName,
                phone: this.data.phone
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

    // 点击编辑icon
    onClickIcon(e) {
        let id = e.currentTarget.dataset.id;
        let arr = this.data.isReadonly;
        arr[id] = !arr[id];
        this.setData({
            isReadonly: arr
        })
        // 提示
        let title = id == 0 ? '昵称' : '手机号';
        if (arr[id] == false) {
            wx.showToast({
                title: '打开编辑' + title,
            })
        } else {
            wx.showToast({
                title: '关闭编辑' + title,
            })
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 设置用户信息
        let userinfo = JSON.parse(options.userinfo);
        this.setData({
            id: userinfo.id,
            avatarUrl: userinfo.avatarUrl,
            nickName: userinfo.nickName,
            phone: userinfo.phone
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