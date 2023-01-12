// pages/mapSearch/mapSearch.js
const app = getApp();
// 引入SDK核心类，js文件根据自己业务，位置可自行放置
var QQMapWX = require('../../lib/qqmap-wx-jssdk1.2/qqmap-wx-jssdk');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
    key: app.mapApiKey
});
import Toast from '@vant/weapp/toast/toast';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 搜索框的值
        searchValue: '',

        mapKey: 'BURBZ-XE7K3-TS43N-YRIQT-XIMFS-72F4H',
        latitude: 21.64109,
        longitude: 110.91879,
        distance: '',
        distance: '',
        scale: 16,
        currMaker: {},
        markers: [],
        markerIcon: '/images/mapSearch/location.png',
        markerIconActive: '/images/mapSearch/location.png',
    },

    // 点击气泡
    clickCallout(e){
        console.log(e);
    },

    clearMap() {

    },

    onSearch() {
        wx.showLoading({
            title: '搜索中',
        })

        let arr = []
        let _markers = this.data.markers
        let matchLoc = 0
        for (let i = 0; i < _markers.length; i++) {
            // 模糊查询
            if (_markers[i].address.indexOf(this.data.searchValue) != -1) {
                matchLoc++;
                arr.push({
                    address: _markers[i].address,
                    latitude: _markers[i].latitude,
                    longitude: _markers[i].longitude,
                    id: _markers[i].id,
                    width: 35,
                    height: 35,
                    iconPath: '/images/mapSearch/location_active.png',
                    callout: {
                        content: `名称：${_markers[i].address}\n点击我查看详情`,
                        display: 'ALWAYS',
                        color: '#333333',
                        bgColor: '#fff',
                        padding: 10,
                        borderRadius: 10,
                        borderColor: '#fff',
                        fontSize: 12,
                        borderWidth: 5,
                        textAlign: 'center',
                    },
                })
            } else {
                arr.push({
                    address: _markers[i].address,
                    latitude: _markers[i].latitude,
                    longitude: _markers[i].longitude,
                    id: _markers[i].id,
                    width: 35,
                    height: 35,
                    iconPath: '/images/mapSearch/location.png',
                    callout: {
                        display: 'BYCLICK'
                    }
                })
            }
        }
        this.setData({
            markers: arr
        })
        wx.hideLoading({
            success: (res) => {
                console.log(arr)
                if (matchLoc > 0) {
                    Toast.success(`标红${matchLoc}处地点`);
                } else {
                    Toast.fail('搜索不到相关图书！');
                }
            },
        })
    },

    clickAddScale() {
        var that = this;
        console.log("scale===" + this.data.scale)
        that.setData({
            scale: ++this.data.scale
        })
    },

    clickSubScale() {
        var that = this;
        console.log("scale===" + this.data.scale)
        that.setData({
            scale: --this.data.scale
        })
    },

    /**
     * 回到自己位置
     */
    controltap() {
        this.mapCtx.moveToLocation()
        this.getMyLocation()
        this.setData({
            scale: 17
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: _this.data.mapKey
        })
        this.getMyLocation()
    },
    onReady: function (e) {
        this.mapCtx = wx.createMapContext('myMap')
    },
    // 获取我的位置
    getMyLocation: function () {
        var that = this;
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                let arr = [{
                    iconPath: '/images/mapSearch/location.png',
                    width: 35,
                    height: 35,
                    address: '文化广场',
                    latitude: 21.666565,
                    longitude: 110.947368,
                    id: 0,
                    callout: {
                        display: 'BYCLICK'
                    }
                }, {
                    iconPath: '/images/mapSearch/location.png',
                    width: 35,
                    height: 35,
                    address: '宏御帝景豪庭',
                    latitude: 21.663962,
                    longitude: 110.940594,
                    id: 1,
                    callout: {
                        display: 'BYCLICK'
                    }
                }, {
                    iconPath: '/images/mapSearch/location.png',
                    width: 35,
                    height: 35,
                    address: '嘉隆公寓',
                    latitude: 21.661376,
                    longitude: 110.943846,
                    id: 2,
                    callout: {
                        display: 'BYCLICK'
                    }
                }]
                that.setData({
                    markers: arr
                })
            }
        })
    },
    // marker的点击事件
    bindmarkertap(e) {
        console.log('e', e)
        let that = this
        let _markers = that.data.markers
        let markerId = parseInt(e.detail.markerId)
        console.log(markerId);
        wx.showLoading({
            title: '加载中',
        })
        _markers.forEach(item => {
            if (parseInt(item.id) === markerId) {
                console.log('item', item)
                that.setData({
                    currMaker: item
                })
            }
        })
        let currMaker = that.data.currMaker
        console.log('currMaker', that.data.currMaker)

        // 地图中心移至点击的maker
        this.mapCtx.moveToLocation({
            latitude: currMaker.latitude,
            longitude: currMaker.longitude
        });

        qqmapsdk.calculateDistance({
            to: [{
                latitude: currMaker.latitude,
                longitude: currMaker.longitude
            }],
            success: function (res) {
                let destinationDistance = res.result.elements[0].distance
                let distanceKm = `${(destinationDistance)}m` // 转换成m
                let arr = []
                for (let i = 0; i < _markers.length; i++) {
                    if (parseInt(_markers[i].id) === markerId) {
                        arr.push({
                            address: _markers[i].address,
                            latitude: _markers[i].latitude,
                            longitude: _markers[i].longitude,
                            id: _markers[i].id,
                            width: 35,
                            height: 35,
                            iconPath: '/images/mapSearch/location_active.png',
                            callout: {
                                content: `名称：${_markers[i].address}\n距您：${distanceKm}\n点击我查看详情`,
                                display: 'ALWAYS',
                                color: '#333333',
                                bgColor: '#fff',
                                padding: 10,
                                borderRadius: 10,
                                borderColor: '#fff',
                                fontSize: 12,
                                borderWidth: 5,
                                textAlign: 'left',
                            },
                        })
                    } else {
                        arr.push({
                            address: _markers[i].address,
                            latitude: _markers[i].latitude,
                            longitude: _markers[i].longitude,
                            id: _markers[i].id,
                            width: 35,
                            height: 35,
                            iconPath: '/images/mapSearch/location.png',
                            callout: {
                                display: 'BYCLICK'
                            }
                        })
                    }
                }
                that.setData({
                    markers: arr
                })
                wx.hideLoading({
                    success: (res) => {
                        console.log(arr)
                    },
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.mapCtx = wx.createMapContext('myMap')
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