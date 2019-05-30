var mConfigs = require('../utils/config.js')
var app = getApp()

function login(){
  // 登录
  wx.login({
    success: res => {
      if (res.code) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: mConfigs.HOST_NAME + '/login',
          data: {
            code: res.code,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var res = res.data;
            wx.setStorage({
              key: 'openid',
              data: res.openid,
            });
            app.globalData.openid = res.openid;
            if (app.globalData.openid!=null){
              wx.showToast({
                title: '登陆成功',
              })
            }
          }
        })
      } else {
        console.log('登陆失败' + res.errMsg);
        wx.showToast({
          title: '登陆失败',
        })
      }

    }
  })


}

module.exports.login = login