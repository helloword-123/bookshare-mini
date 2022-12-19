// pages/loginInfoInput/loginInfoInput.js
const app = getApp();
const defaultAvatarUrl = "https://edu-wuhaojie.oss-cn-shenzhen.aliyuncs.com/bookshare/2022/12/16/7b3aebe1ed9146b5a53e742343b02611f778738c-e4f8-4870-b634-56703b4acafe.gif";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: '',
    // 输入框值
    value: '',
    // 弹出框是否显示
    show: true,
  },

  editConfirm() {
    // 保存信息
  },

  onClose() {
    this.setData({
      show: false
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
    // this.uploadFile();
  },

  // 上传头像
  uploadFile(){
    wx.uploadFile({
      url: app.globalData.baseUrl + 'common/uploadFile', //后台接口
      filePath: this.avatarUrl, // 上传图片 url
      name:'image',
      // formData: this.formData,
      header: {
        'content-type': 'multipart/form-data',
        'token': app.getStorageSync('header_token')
      }, // header 值
      success: res => {
        console.log(res);
        this.$toast('上传成功')
      },
      fail: e => {
        this.$toast('上传失败')
      }
    });
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