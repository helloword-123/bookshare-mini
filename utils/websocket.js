/**
 * TODO websocket封装
 * 吴浩杰
 * 2020年3月19日14:30:03
 */
var app = getApp();

const websocketUrl = app.globalData.websocketUrl + app.globalData.userinfo.id; // websocket服务器baseUrl
let sotk = null;
let socketOpen =false;

function ws_connect(func){
  // 连接
  sotk = wx.connectSocket({
    url: websocketUrl,
    header: {
      'content-type': 'application/json'
    }
  })
  // 连接打开
  sotk.onOpen(res => {
    socketOpen = true;
    console.log('监听 WebSocket 连接打开事件。', res);
  })
  // 连接关闭
  sotk.onClose(onClose => {
    socketOpen = false;
    console.log('监听 WebSocket 连接关闭事件。', onClose)
  })
  // 出错
  sotk.onError(onError => {
    socketOpen = false;
    console.log('监听 WebSocket 错误。错误信息', onError)
  })
  // 收到服务器消息
  sotk.onMessage(res => {
    func(res);
  })
}

function onClose(){
  sotk.close()
}

// 导出
module.exports.ws_connect = ws_connect;
module.exports.onClose = onClose;