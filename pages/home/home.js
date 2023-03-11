// pages/home/home.js
import {
  setWatcher
} from '../../utils/watch'
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
    location: app.location,
    // 轮播图相关数据
    imgList: ['/images/swiper/1.jpg', '/images/swiper/2.jpg', '/images/swiper/3.jpg'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    // 分类标签
    tab_active: 0,
    bookList: []
  },

  getAllRolesById(userId){
    app.asyncRequest('GET', app.globalData.baseurl + `user/getUserRoles/${userId}`)
    .then(res=>{
      app.globalData.userRoles = res.data.roles;
    })
  },

  clickBook(e) {
    const {categoryid, bookid} = e.currentTarget.dataset;
    
    let param = {}
    this.data.bookList.forEach(b=>{
      if(b.bookCategory.id == categoryid){
        b.list.forEach(book=>{
          if(book.bookId == bookid){
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

  borrowClick() {
    wx.navigateTo({
      url: '/pages/borrow/borrow',
    })
  },

  getIdByCategoryName(name) {
    const {
      categorys
    } = this.data;
    for (var item of categorys) {
      if (item.name == name) {
        return item.id;
      }
    }
    return 1;
  },

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

  // watch:{
  //   // van-tabs 组件 切换tabs时
  //   tab_active:{
  //     immediate:true,
  //     handler:function(val){
  //       console.log('第几个',val)
  //     }
  //   },
  // },

  clickSearch() {
    wx.navigateTo({
      url: '/pages/mapSearch/mapSearch',
    })
  },

  onClickTab(event) {
    console.log(event);
    this.setData({
      tab_active: event.detail.name
    })

    // 获取分类id
    var id = this.getIdByCategoryName(event.detail.title);

    wx.showToast({
      title: `点击标签 ${event.detail.name}`,
      icon: 'none',
    });
  },

  clickLocation() {

  },

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
                  duration: 1000
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
          console.log('授权成功')
          //调用wx.getLocation的API
          that.initGetLocationFlunction();
        }
      }
    })
  },

  shareClick() {
    wx: wx.navigateTo({
      url: '/pages/share/share',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 连接websocket
    websocket.ws_connect(app.receiveMsg);
    // // 在onload的时候调用一次监听函数，然后就可以像vue一样愉快的使用watch了
    // setWatcher(this);

    // 获取用户所有角色
    this.getAllRolesById(app.globalData.userinfo.id);

    // 获取一级目录
    this.getListWithCategory();

    // wx.getLocation({
    //   type: 'gcj02',
    //   success(res) {
    //     console.log('纬度' + res.latitude)
    //     console.log('经度' + res.longitude)
    //   },
    //   fail(err) {
    //     console.log(err);
    //   }
    // })
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
    // 获取位置信息
    this.initLocationPersmiss();

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