// pages/share/share.js
const app = getApp();

import Toast from '@vant/weapp/toast/toast'

// 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../../lib/qqmap-wx-jssdk1.2/qqmap-wx-jssdk');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: app.mapApiKey
});

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 当前步骤
        active: 0,
        // 所有步骤信息
        steps: [{
                text: '步骤一',
                desc: '扫ISBN编码',
            },
            {
                text: '步骤二',
                desc: '填写信息',
            }
        ],
        // 步骤二输入框
        userName: '',
        phoneNumber: '',
        will: '',
        location: '点击按钮获取位置',
        // 图片上传
        fileList: [],
        // 是否显示dialog
        showDialog: false,
        // 分类级联组件
        fieldNames: {
            text: 'name',
            value: 'id',
            children: 'children',
        },
        options: [],
        showCascader: false,
        fieldValue: '',
        cascaderValue: '',
    },

    // 获取定位
    initGetLocationFlunction() {
        if (app.location != '') {
            this.setData({
                location: app.location
            })
            return;
        }

        var that = this
        // 调用接口，获取用户地理位置
        qqmapsdk.reverseGeocoder({
            success: function (res) {
                console.log(res);
                that.setData({
                    location: res.result.address
                })
                app.location = res.result.address;
                app.lat = res.result.location.lat;
                app.lng = res.result.location.lng;
            },
            fail: function (res) {
                console.log(res.status, res.message);
            },
            complete: function (res) {
                // console.log(res.status, res.message);
            }
        })
    },

    // 点击获取昵称icon
    onClickUserNameIcon() {
        if (app.globalData.userinfo.nickName == undefined) {
            wx.showToast({
                title: '获取昵称失败',
                icon: 'error'
            })
            return;
        }
        this.setData({
            userName: app.globalData.userinfo.nickName,
        })
        wx.showToast({
            title: '获取昵称成功',
            icon: 'success'
        })
    },

    // 点击获取手机号icon
    onClickPhoneNumIcon() {
        if (app.globalData.userinfo.phone == undefined) {
            wx.showToast({
                title: '获取手机号失败',
                icon: 'error'
            })
            return;
        }
        this.setData({
            phoneNumber: app.globalData.userinfo.phone,
        })
        wx.showToast({
            title: '获取手机号成功',
            icon: 'fail'
        })
    },

    // 获取一二级图书分类
    getCategoryCascader() {
        app.asyncRequest('GET', app.globalData.baseurl + 'book-category/getCategoryCascader')
            .then(res => {
                console.log(res);
                this.setData({
                    options: res.data.options

                })
            })
    },

    // 点击图书分类
    onClickCascader() {
        this.setData({
            showCascader: true,
        });
    },

    // 关闭图书分类
    onCloseCascader() {
        this.setData({
            showCascader: false,
        });
    },

    // 结束图书分类选择
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
        console.log(this.data.fieldValue);
        console.log(this.data.cascaderValue);
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

    // 点击”我要共享“按钮
    shareCommit() {
        // 上传表单信息到后台
        const {
            bookinfo
        } = this.data;

        // 检验
        // 1. 空检测
        if (this.data.cascaderValue == '') {
            wx.showModal({
                title: '提示',
                content: '图书分类不能为空!',
                showCancel: false,
            })
            return;
        }
        if (this.data.userName == '') {
            wx.showModal({
                title: '提示',
                content: '昵称不能为空!',
                showCancel: false,
            })
            return;
        }
        if (this.data.phoneNumber == '') {
            wx.showModal({
                title: '提示',
                content: '手机号不能为空!',
                showCancel: false,
            })
            return;
        }
        if (this.data.will == '') {
            wx.showModal({
                title: '提示',
                content: '共享愿望不能为空!',
                showCancel: false,
            })
            return;
        }
        if (this.data.location == '点击按钮获取位置') {
            wx.showModal({
                title: '提示',
                content: '未获取当前位置!',
                showCancel: false,
            })
            return;
        }
        // 2. 格式校验
        let regPhoneNumber = /^1[3578]\d{9}$/;
        let regUserName = /^[\w\u4e00-\u9fa5]{5,18}$/;
        // if(!regUserName.test(this.data.userName)){
        //     wx.showModal({
        //         title: '提示',
        //         content: '昵称格式有误!',
        //         showCancel: false,
        //     })
        //     return false
        // }
        if(!regPhoneNumber.test(this.data.phoneNumber)){
            wx.showModal({
                title: '提示',
                content: '手机号格式有误!',
                showCancel: false,
            })
            return false
        }

        app.asyncRequest('POST', app.globalData.baseurl + 'book-drift/shareBook', {
                // 传给后端的信息
                // 图书信息
                code: bookinfo.code,
                name: bookinfo.name,
                author: bookinfo.author,
                publishing: bookinfo.publishing,
                published: bookinfo.published,
                photoUrl: bookinfo.photoUrl,
                description: bookinfo.description,
                cascaderValue: this.data.cascaderValue,
                // 表单信息
                userName: this.data.userName,
                phoneNumber: this.data.phoneNumber,
                will: this.data.will,
                location: this.data.location,
                latitude: app.lat,
                longitude: app.lng,
                fileList: this.data.fileList,
                userId: app.globalData.userinfo.id
            })
            .then(res => {
                console.log(res);
                if (res.code == 20000) {
                    // 弹出框显示
                    this.setData({
                        showDialog: true
                    })
                } else if (res.code == 20001) {
                    wx.showToast({
                        title: '分享出错',
                        icon: 'error'
                    })
                }
            })
            .catch(err => {
                console.log(res);
            })
    },

    // 点击”确定“按钮
    commit() {
        // 跳转到首页
        wx: wx.switchTab({
            url: '/pages/home/home'
        })
    },

    // 点击扫一扫
    clickScanButton() {
        // 检测是否认证通过
        if (app.globalData.userinfo.isAuth == false) {
            wx.showModal({
                title: '提示',
                content: '您未认证或者认证未通过，请先认证！',
                success(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/auth/auth',
                        })
                    } else if (res.cancel) {

                    }
                }
            })
            return;
        }

        // 调用api扫描ISBN
        wx.scanCode({
            scanType: ['barCode'],
            success: res => {
                let regISBN = /^[0-9]{10}|[0-9]{13}$/;
                if (!regISBN.test(res.result)) {
                    wx.showModal({
                        title: '错误',
                        content: '扫码错误',
                        showCancel: false,
                        success(res) {}
                    })
                    return;
                }
                var isbn = res.result;
                // 根据isbn号发起请求
                var apikey = '14778.d240ab28c857b24b46148ca6351116a2.b03531cb33b522960cdb109e88e651bc';
                var url = 'https://api.jike.xyz/situ/book/isbn/' + isbn + '?apikey=' + apikey;
                app.asyncRequest('GET', url)
                    .then(res => {
                        console.log(res);
                        // 设置信息
                        this.setData({
                            bookinfo: res.data,
                        })
                        return this.checkIsbnIsExist(isbn);
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            fail: err => {
                console.log(err);
            }
        })
    },

    // 后台请求，判断改isbn号的图书是否已经在漂流中
    checkIsbnIsExist(isbn) {
        app.asyncRequest('GET', app.globalData.baseurl + 'book/isDrifting/' + isbn)
            .then(ret => {
                console.log(ret);
                wx.showToast({
                    title: '扫码成功',
                    icon: 'success'
                })
                // 获取一二级目录
                this.getCategoryCascader();
                // 跳转下一步
                this.setData({
                    active: 1
                })
            })
            .catch(err => {
                Toast.fail('请求出错！');
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