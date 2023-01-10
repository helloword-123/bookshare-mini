const app = getApp();
// 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../lib/qqmap-wx-jssdk1.2/qqmap-wx-jssdk');
// 实例化API核心类
var qqmapsdk  = new QQMapWX({
    key: app.mapApiKey
  });


const initGetLocationFlunction = () => {
    // 调用接口，获取用户地理位置
    qqmapsdk.reverseGeocoder({
        success: function (res) {
            console.log(res);
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
}

// 如果用户第一次拒绝授权定位，则需要调用此方法
const initLocationPersmiss = () => {
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
                                        initGetLocationFlunction();
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
                initGetLocationFlunction();
            } else {
                console.log('授权成功')
                //调用wx.getLocation的API
                initGetLocationFlunction();
            }
        }
    })
}

module.exports = {
    initGetLocationFlunction,
    initLocationPersmiss
}