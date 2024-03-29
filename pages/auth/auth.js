// pages/auth/auth.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 学号
        number: '',
        // 真名
        realName: '',
        // 手机号
        phone: '',
        // 邮箱
        email: '',
        // 图片列表
        fileList: [],
        // 审核结果
        status: 1,
        // 审核意见
        description: '',
        // 审核提示
        result: [{
                img: '/images/auth/checking.png',
                title: '您提交的认证信息正在审核中'
            },
            {
                img: '/images/auth/check_success.png',
                title: '审核通过'
            },
            {
                img: '/images/auth/check_fail.png',
                title: '审核不通过'
            }
        ]
    },

    // 点击“重新申请”
    reAuth() {
        this.setData({
            status: -1
        })
    },

    // 获取审核信息
    getAuthInfo() {
        app.asyncRequest('GET', app.globalData.baseurl + `campus-staff-auth/getAuthInfo/${app.globalData.userinfo.id}`)
            .then(res => {
                // 未验证
                if (res.data.campusStaffAuth == null) {
                    this.setData({
                        status: -1
                    })
                    return;
                }
                this.setData({
                    status: res.data.campusStaffAuth.status,
                    description: res.data.campusStaffAuth.description,
                })
            })
    },

    // 提交审核
    commit() {
        // 校验
        let regRealName = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/;
        let regPhone = /^1[3578]\d{9}$/;
        let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
        // 1. 空判断
        if (this.data.number == "") {
            wx.showModal({
                title: '提示',
                content: '学号/工号不能为空!',
                showCancel: false,
            })
            return false
        }
        if (this.data.realName == "") {
            wx.showModal({
                title: '提示',
                content: '姓名不能为空!',
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
        if(!regRealName.test(this.data.realName)){
            wx.showModal({
                title: '提示',
                content: '姓名格式有误!',
                showCancel: false,
            })
            return false
        }
        if(!regPhone.test(this.data.phone)){
            wx.showModal({
                title: '提示',
                content: '手机号格式有误!',
                showCancel: false,
            })
            return false
        }
        if(!regEmail.test(this.data.email)){
            wx.showModal({
                title: '提示',
                content: '邮箱格式有误!',
                showCancel: false,
            })
            return false
        }

        let imgList = [];
        this.data.fileList.forEach(img => {
            imgList.push(img.url);
        })
        app.asyncRequest('POST', app.globalData.baseurl + 'campus-staff-auth/add', {
                userId: app.globalData.userinfo.id,
                number: this.data.number,
                realName: this.data.realName,
                phone: this.data.phone,
                email: this.data.email,
                fileList: imgList
            })
            .then(res => {
                wx.showModal({
                    title: '提示',
                    content: '提交成功',
                    showCancel: false,
                    success(res) {
                      wx.navigateBack({
                        delta: 1,
                      })
                    }
                  })
            })
    },

    // 点击图片上传
    afterRead(event) {
        const {
            file
        } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
            url: app.globalData.baseurl + 'common/uploadFile', //后台接口
            filePath: file.url,
            name: 'image',
            // formData: this.formData,
            header: {
                'content-type': 'multipart/form-data',
                'token': wx.getStorageSync('header_token')
            }, // header 值
            success: (res) => {
                // 上传完成需要更新 fileList
                console.log('上传成功')
                res = JSON.parse(res.data)
                const {
                    fileList = []
                } = this.data;
                fileList.push({
                    ...file,
                    url: res.data.url
                });
                this.setData({
                    fileList
                });
            },
            fail: e => {
                console.log('上传失败')
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取审核信息
        this.getAuthInfo();
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