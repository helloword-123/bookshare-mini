// pages/bindingPhone/bindingPhone.js

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        phoneValid: false,
        code: '',
        countdownActive: false,
        countdownText: '发送验证码',
        sendBtnText: '发送验证码',
        countdownDuration: 60,
        agreed: false,
        loginValid: false,
        // logo图片url
        picurl: "https://edu-wuhaojie.oss-cn-shenzhen.aliyuncs.com/bookshare/2022/12/16/7b3aebe1ed9146b5a53e742343b02611f778738c-e4f8-4870-b634-56703b4acafe.gif"
    },

    bindPhoneInput: function (e) {
        const phone = e.detail.value
        this.setData({
            phone: phone,
            phoneValid: /^1\d{10}$/.test(phone)
        })
        this.updateLoginValid()
    },

    bindCodeInput: function (e) {
        const code = e.detail.value
        this.setData({
            code: code
        })
        this.updateLoginValid()
    },

    bindAgreeChange: function (e) {
        const agreed = e.detail.value.length > 0
        this.setData({
            agreed: agreed
        })
        this.updateLoginValid()
    },

    sendCode: function () {
        // 发起请求
        app.asyncRequest('GET', app.globalData.baseurl + `user/sendSmsCode/${this.data.phone}`)
            .then(res => {
                const that = this
                let countdown = this.data.countdownDuration
                this.setData({
                    countdownActive: true,
                    sendBtnText: `${countdown} 秒后重发`
                })
                const timer = setInterval(function () {
                    countdown--
                    if (countdown > 0) {
                        that.setData({
                            countdownText: `${countdown} 秒后重发`
                        })
                    } else {
                        clearInterval(timer)
                        that.setData({
                            countdownActive: false,
                            countdownText: '重新发送',
                        })
                    }
                }, 1000)
            })
            .catch(err => {
                wx.showToast({
                    title: '发送失败！',
                    icon: "error"
                })
            })
    },

    countdown: function () {
        if (this.data.countdownActive) {
            return
        }
        if (!this.data.phoneValid) {
            wx.showModal({
                title: '提示',
                content: '手机号格式有误!',
                showCancel: false,
            })
            return
        }
        this.sendCode()
    },

    login: function () {
        if (!this.data.loginValid) {
            return
        }
        // 验证
        app.asyncRequest('POST', app.globalData.baseurl + `user/verifySmsCode`, {
                userId: app.globalData.userinfo.id,
                phone: this.data.phone,
                code: this.data.code
            })
            .then(res => {
                app.globalData.userinfo.isBindingPhone = true;
                app.globalData.userinfo.phone = this.data.phone;
                wx.showModal({
                    title: '提示',
                    content: '绑定成功！',
                    showCancel: false,
                    success(res) {
                      wx.navigateBack({
                        delta: 1,
                      })
                    }
                })
            })
    },

    updateLoginValid: function () {
        const phoneValid = this.data.phoneValid
        const codeValid = this.data.code.length > 0
        const agreed = this.data.agreed
        const loginValid = phoneValid && codeValid && agreed
        this.setData({
            loginValid: loginValid
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