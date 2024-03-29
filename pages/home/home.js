// pages/home/home.js
const app = getApp();
var websocket = require('../../utils/websocket')

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
    // 搜索框值
    value: '',
    // 位置
    location: '请授权获取位置',
    // 轮播图相关数据
    imgList: ['/images/swiper/1.jpg', '/images/swiper/2.jpg', '/images/swiper/3.jpg'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    // 图书分类所选值
    tab_active: 0,
    // 图书列表
    bookList: [],
    // 是否需要加载数据
    isLogin: false,
    flag: false
  },

  // 获取用户信息
  getUserInfoByToken() {
    app.asyncRequest('GET', app.globalData.baseurl + `user/getUserInfoByToken`)
      .then(res => {
        // 设置用户信息
        app.globalData.userinfo = res.data.userinfo;
      })
  },

  // 获取用户角色
  getAllRolesById(userId) {
    app.asyncRequest('GET', app.globalData.baseurl + `user/getUserRoles/${userId}`)
      .then(res => {
        app.globalData.userRoles = res.data.roles;
      })
  },

  // 点击图书
  clickBook(e) {
    const {
      categoryid,
      bookid
    } = e.currentTarget.dataset;

    let param = {}
    this.data.bookList.forEach(b => {
      if (b.bookCategory.id == categoryid) {
        b.list.forEach(book => {
          if (book.bookId == bookid) {
            param = book;
            return;
          }
        })
      }
    })
    wx.navigateTo({
      url: `/pages/bookBorrowDetail/bookBorrowDetail?bookinfo=${JSON.stringify(param)}`,
    })
  },

  // 点击借阅
  borrowClick() {
    wx.navigateTo({
      url: '/pages/borrow/borrow',
    })
  },

  // 获取图书列表
  getListWithCategory() {
    wx.showLoading({
      title: '加载中',
    })
    app.asyncRequest('GET', app.globalData.baseurl + `book/getListWithCategory`)
      .then(res => {
        console.log(res);
        this.setData({
          bookList: res.data.bookList
        })

        wx.hideLoading({
          success: (res) => {},
        })
      })
  },

  // 点击地图搜索
  clickSearch() {
    wx.navigateTo({
      url: '/pages/mapSearch/mapSearch',
    })
  },

  // 点击tab
  onClickTab(event) {
    console.log(event);
    this.setData({
      tab_active: event.detail.name
    })

    // wx.showToast({
    //   title: `点击标签 ${event.detail.name}`,
    //   icon: 'none',
    // });
  },

  // 点击地址
  clickLocation() {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        app.location = res.address;
        app.lat = res.latitude;
        app.lng = res.longitude;
        that.setData({
          location: app.location
        })
      },
      fail: function () {},
      complete: function () {}
    })
  },

  // 获取定位
  initGetLocationFlunction() {
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
        app.chooseLocation = true;
      },
      fail: function (res) {
        console.log(res.status, res.message);
      },
      complete: function (res) {
        // console.log(res.status, res.message);
      }
    })
  },

  // 如果用户第一次拒绝授权定位，则需要调用此方法
  initLocationPersmiss() {
    var that = this
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined  表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false  表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true  表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权 暂时无法使用本功能',
                  icon: 'none',
                  duration: 2000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.initGetLocationFlunction();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          that.initGetLocationFlunction();
        } else {
          //console.log('授权成功')
          //调用wx.getLocation的API
          if (app.chooseLocation == false) {
            that.initGetLocationFlunction();
          } else{
            if(app.location == ''){
              that.initGetLocationFlunction();
              return;
            }
            that.setData({
              location: app.location
            })
          }
        }
      }
    })
  },

  // 验证token（处理未登录）
  checkToken() {
    app.asyncRequest('GET', app.globalData.baseurl + 'user/checkToken')
      .then(res => {
        if (res.data.isValid == true) {
          if (websocket.socketOpen == false) {
            // 连接websocket
            websocket.ws_connect(app.receiveMsg);
          }
          // 获取用户信息
          this.getUserInfoByToken();
          // 获取一级目录
          this.getListWithCategory();
          // 获取位置信息
          this.initLocationPersmiss();
          this.setData({
            flag: true
          })
          return;
        }
        wx.showModal({
          title: '提示',
          content: '请先登录',
          showCancel: false,
          success(res) {
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        })
      })
  },

  // 点击分享
  shareClick() {
    wx: wx.navigateTo({
      url: '/pages/share/share',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 验证token
    this.checkToken();
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
    if(this.data.flag == true){
      // 获取位置信息
      this.initLocationPersmiss();
    }
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