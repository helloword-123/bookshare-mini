/**
 * TODO websocket封装
 * wjw
 * 2020年3月19日14:30:03
 */
var app = getApp();

const websocketUrl = app.globalData.websocketUrl + app.globalData.userinfo.id; // websocket服务器baseUrl
let sotk = null;
let socketOpen =false;

function ws_connect(func){
  sotk = wx.connectSocket({
    url: websocketUrl,
    header: {
      'content-type': 'application/json'
    }
  })

  sotk.onOpen(res => {
    socketOpen = true;
    console.log('监听 WebSocket 连接打开事件。', res);
  })
  sotk.onClose(onClose => {
    socketOpen = false;
    console.log('监听 WebSocket 连接关闭事件。', onClose)
  })
  sotk.onError(onError => {
    socketOpen = true;
    console.log('监听 WebSocket 错误。错误信息', onError)
  })

  // 收到消息
  sotk.onMessage(res => {
    func(res);
  })
}

function sendMsg(msg, success){
  if (socketOpen) {
      console.log(socketOpen);
    sotk.send({
      data: msg
    }, function (res) {
      success(res)
    })
  }
}

function onClose(){
  console.log("111");
  sotk.close()
  // if (socketOpen) {
  //   sotk.onClose()
  // }
}

module.exports.ws_connect = ws_connect;
module.exports.sendMsg = sendMsg;
module.exports.onClose = onClose;