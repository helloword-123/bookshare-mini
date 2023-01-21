// pages/loginInfoInput/loginInfoInput.js
const app = getApp();
const defaultAvatarUrl = "https://edu-wuhaojie.oss-cn-shenzhen.aliyuncs.com/bookshare/2022/12/16/7b3aebe1ed9146b5a53e742343b02611f778738c-e4f8-4870-b634-56703b4acafe.gif";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    // 输入框值
    nickname: '',
    // 弹出框是否显示
    show: true,
  },

  editConfirm() {
    // 保存信息

  },

  onChangeName(){
    // console.log(this.data.nickname);
  },

  onClose() {
    console.log(this.data.nickname);
    this.setData({
      show: false
    });
    // 更新用户信息
    app.asyncRequest('POST', app.globalData.baseurl + 'user/updateUserInfo', {
        avatarUrl: this.data.avatarUrl,
        id: app.globalData.userinfo.id,
        nickName: this.data.nickname
      })
      .then(res => {
        console.log(res);
        // 跳转到首页
        wx: wx.switchTab({
          url: '/pages/home/home'
        })
      }).catch(err => {
        console.log(err)
      });
  },


  onChooseAvatar(e) {
    console.log(e);
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
    // 上传头像
    this.uploadFile();
  },

  // 上传头像
  uploadFile() {
    console.log(this.data.avatarUrl);
    wx.uploadFile({
      url: app.globalData.baseurl + 'common/uploadFile', //后台接口
      filePath: this.data.avatarUrl, // 上传图片 url
      name: 'image',
      // formData: this.formData,
      header: {
        'content-type': 'multipart/form-data',
        'token': wx.getStorageSync('header_token')
      }, // header 值
      success: res => {
        console.log('上传成功')
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
    this.setData({
      nickname: options.nickname,
      avatarUrl: options.avatarurl
    })
    if (options.avatarurl == null || options.avatarurl.length == 0) {
      this.setData({
        avatarUrl: defaultAvatarUrl
      })
    }
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