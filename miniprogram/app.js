//app.js
var mConfigs = require('./utils/config.js')
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}

    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    try {
      const value = wx.getStorageSync('openid')
      const userId = that.globalData.openid
      if (value === undefined && value === "" && value === null && userId == null) {
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
                  that.globalData.openid = res.openid;
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

        // Do something with return value
      } else {
        console.log('openid is ' + value)
        that.globalData.openid = value;
      }
    } catch (e) {
      // Do something when catch error
      console.log(e);
    }


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    openid: null,
    phoneNum: '',
    deliverAddress: ''

  }
  

})
