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
        // QQ的map地图的key
        mapKey: 'BURBZ-XE7K3-TS43N-YRIQT-XIMFS-72F4H',
        // 纬度
        latitude: 21.658257,
        // 经度
        longitude: 110.935318,
        // 距离
        distance: '',
        // 缩放值
        scale: 16,
        // 当前所选marker
        currMaker: {},
        // 所有地图marker
        markers: [],
        // 地图连线
        polyline: [{
            points: [],
            color: "#00a131",
            width: 4
        }],
        // 路径规划信息
        routePlanningInfo: [],
        // 漂流的图书列表
        driftingBooks: [],
        // 图书详情
        bookBorrowDetail: {},
        // 是否显示图书
        showBook: false,
        // 导航标签
        tab_active: 0,
        // 交通方式
        trafficType: [{
                title: '驾车'
            },
            {
                title: '步行'
            },
            {
                title: '骑行'
            }
        ],
        // 是否显示导航提示
        isShow: false,
    },

    // 点击图书
    clickBook(e) {
        wx.navigateTo({
            url: `/pages/bookBorrowDetail/bookBorrowDetail?bookinfo=${JSON.stringify(this.data.bookBorrowDetail)}`,
        })
    },

    // 点击路线规划
    onClickRoutePlanning() {
        // 三种交通类型，分别操作
        // api文档：https://lbs.qq.com/service/webService/webServiceGuide/webServiceRoute#2
        let type = 'driving';
        switch (this.data.tab_active) {
            case 0: { // 驾车
                type = 'driving';
                break;
            }
            case 1: { // 步行
                type = 'walking';
                break;
            }
            case 2: { //骑行
                type = 'bicycling';
                break;
            }
        }
        let url = `https://apis.map.qq.com/ws/direction/v1/${type}/`
        // 发起请求
        app.asyncRequest('GET', url, {
                key: app.mapApiKey,
                from: `${this.data.latitude},${this.data.longitude}`,
                to: `${this.data.currMaker.latitude},${this.data.currMaker.longitude}`,
                output: 'json'
            })
            .then(res => {
                console.log(res);
                // polyline 坐标解压
                let points = [];
                let polyline = res.result.routes[0].polyline;
                for (var i = 2; i < polyline.length; i++) {
                    polyline[i] = polyline[i - 2] + polyline[i] / 1000000;
                }
                for (var i = 0; i < polyline.length; i += 2) {
                    points.push({
                        latitude: polyline[i],
                        longitude: polyline[i + 1]
                    })
                }
                this.setData({
                    polyline: [{
                        points,
                        color: "#00a131",
                        width: 4,
                    }]
                })
                this.setData({
                    routePlanningInfo: res.result.routes[0],
                    isShow: true
                })
            })
    },

    // 点击tab
    onClickTab(event) {
        console.log(event);
        this.setData({
            tab_active: event.detail.name
        })
    },

    // 点击气泡
    clickCallout(e) {
        // 根据marketId（driftId）查询图书漂流信息
        app.asyncRequest('GET', app.globalData.baseurl + `book-drift/getDriftingById/${e.markerId}`)
            .then(res => {
                console.log(res);
                this.setData({
                    bookBorrowDetail: res.data.bookDrift,
                    showBook: true
                })
                wx.showToast({
                    title: '查询信息',
                })
            })
    },

    // 清空地图
    clearMap() {

    },

    // 搜索
    onSearch() {
        this.setData({
            showBook: false
        })
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
                        content: `地址：${_markers[i].address}\n点击我查看详情`,
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
                    // 清除路线
                    this.setData({
                        polyline: []
                    })
                }
            },
        })
    },

    // 点击放大
    clickAddScale() {
        var that = this;
        console.log("scale===" + this.data.scale)
        that.setData({
            scale: ++this.data.scale
        })
    },

    // 点击缩小
    clickSubScale() {
        var that = this;
        console.log("scale===" + this.data.scale)
        that.setData({
            scale: --this.data.scale
        })
    },

    // 回到自己位置
    controltap() {
        this.mapCtx.moveToLocation()
        this.getMyLocation()
        this.setData({
            scale: 14
        })
    },

    // 获取正在漂流的图书数据
    getDriftingBooks() {
        app.asyncRequest('GET', app.globalData.baseurl + 'book-drift/getDriftingBooks')
            .then(res => {
                this.setData({
                    driftingBooks: res.data.driftingBooks
                })
                console.log(this.data.driftingBooks);
                // 初始化地图数据
                this.getMyLocation()
            })
    },

    // 初始化地图
    getMyLocation: function () {
        wx.getLocation({
            type: 'gcj02',
            success: res => {
                console.log(res);
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                // 设置marker
                let arr = []
                // 拼接后台请求的数据和obj
                for (var book of this.data.driftingBooks) {
                    var marker = {}
                    marker.iconPath = '/images/mapSearch/location.png'
                    marker.width = 35
                    marker.height = 35
                    marker.callout = {
                        display: 'BYCLICK'
                    }
                    marker.id = book.id
                    marker.address = book.address
                    marker.latitude = book.latitude
                    marker.longitude = book.longitude
                    arr.push(marker)
                }
                this.setData({
                    markers: arr
                })
            }
        })
    },

    // marker的点击事件
    bindmarkertap(e) {
        this.setData({
            showBook: false,
            isShow: false
        })
        let that = this
        let _markers = that.data.markers
        let markerId = parseInt(e.detail.markerId)
        console.log('markerId: ', markerId);
        wx.showLoading({
            title: '加载中',
        })
        _markers.forEach(item => {
            if (parseInt(item.id) === markerId) {
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
        // 连线
        let points = [{
            latitude: this.data.latitude,
            longitude: this.data.longitude
        }, {
            latitude: currMaker.latitude,
            longitude: currMaker.longitude
        }];
        this.setData({
            polyline: [{
                points,
                color: "#00a131",
                width: 4,
            }]
        })
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
                                content: `地址：${_markers[i].address}\n直线距离：${distanceKm}\n点击我查看详情`,
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取图书列表
        this.getDriftingBooks()
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: this.data.mapKey
        })
    },

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady: function (e) {
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