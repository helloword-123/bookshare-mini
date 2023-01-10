// pages/share/share.js
const app = getApp();

import Toast from '@vant/weapp/toast/toast'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 步骤
        active: 0,
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
        showDialog: false
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
        console.log(this.data.fileList);
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
                // 表单信息
                userName: this.data.userName,
                phoneNumber: this.data.phoneNumber,
                will: this.data.will,
                location: this.data.location,
                fileList: this.data.fileList,
                userId: app.globalData.userinfo.id
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(res);
            })

        // 弹出框显示
        this.setData({
            showDialog: true
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
        // 调用api扫描ISBN
        wx.scanCode({
            scanType: ['barCode'],  
            success: res => {
                console.log(res.result)
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
    checkIsbnIsExist(isbn){
        app.asyncRequest('GET', app.globalData.baseurl + 'book/isDrifting/' + isbn)
            .then(ret => {
                console.log(ret);
                if(ret.code == 20002){
                    // 提示共享失败
                    Toast.fail('该图书正在共享中，无法重复共享！');
                } else{
                    // 跳转下一步
                    this.setData({
                        active: 1
                    })
                }
            })
            .catch(err=>{
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