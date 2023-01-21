// pages/advice/advice.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        contact: '',
        contant: '',
        value: 3,
        // 图片上传
        fileList: [],
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

    formSubmit: function (e) {
        let _that = this;
        let content = e.detail.value.opinion;
        let contact = e.detail.value.contact;
        let regPhone = /^1[3578]\d{9}$/;
        let regEmail = /^[a-z\d_\-\.]+@[a-z\d_\-]+\.[a-z\d_\-]+$/i;
        if (content == "") {
            wx.showModal({
                title: '提示',
                content: '反馈内容不能为空!',
            })
            return false
        }
        if (contact == "") {
            wx.showModal({
                title: '提示',
                content: '手机号或者邮箱不能为空!',
            })
            return false
        }
        if (contact == "" && content == "") {
            wx.showModal({
                title: '提示',
                content: '反馈内容,手机号或者邮箱不能为空!',
            })
            return false
        }
        if ((!regPhone.test(contact) && !regEmail.test(contact)) || (regPhone.test(contact) && regEmail.test(contact))) { //验证手机号或者邮箱的其中一个对
            wx.showModal({
                title: '提示',
                content: '您输入的手机号或者邮箱有误!',
            })
            return false
        } else {
            this.setData({
                loading: true
            })

            let status = false;
            let imgList = [];
            this.data.fileList.forEach(img=>{
                imgList.push(img.url);
            })

            wx.request({
                url: app.globalData.baseurl + 'advice/add',
                method: 'POST',
                data: {
                    "content": content,
                    "contact": contact,
                    "userId": app.globalData.userinfo.id,
                    "fileList": imgList,
                    "star": this.data.value
                },
                success: function (res) {
                    if (res.data.code == 20000) {
                        wx.showToast({
                            title: '反馈成功',
                            icon: 'success',
                            duration: 1000,
                            success: function (res) {
                                //提示框消失后返回上一级页面
                                setTimeout(() => {
                                    wx.navigateBack({
                                        change: true,
                                    })
                                }, 1200)
                            }
                        })
                    } else {
                        wx.showToast({
                            title: '反馈失败，请稍后再试',
                            icon: 'error',
                            duration: 1200
                        });
                    }
                },
                fail: function () {
                    wx.showToast({
                        title: '请求失败~',
                        icon: 'error',
                        duration: 1500
                    })
                }
            })
            return status;
        }
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