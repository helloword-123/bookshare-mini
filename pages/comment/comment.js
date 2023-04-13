// pages/comment/comment.js

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
        loginValid: false
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
        // TODO: 调用后端接口发送验证码
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
                    sendBtnText: '发送验证码'
                })
            }
        }, 1000)
    },

    countdown: function () {
        if (this.data.countdownActive) {
            return
        }
        if (!this.data.phoneValid) {
            // TODO: 弹出提示框提示用户输入正确的手机号
            return
        }
        this.sendCode()
    },

    login: function () {
        if (!this.data.phoneValid) {
            // TODO: 弹出提示框提示用户输入正确的手机号
            return
        }
        if (!this.data.code) {
            // TODO: 弹出提示框提示用户输入验证码
            return
        }
        if (!this.data.agreed) {
            // TODO: 弹出提示框提示用户同意用户协议和隐私政策
            return
        }
        // TODO: 调用后端接口完成登录
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