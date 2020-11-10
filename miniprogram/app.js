//app.js
var mConfigs = require('./utils/config.js')
import locales from './utils/locales'
import T from './utils/i18n'

T.registerLocale(locales);
let savedGlobalData = wx.getStorageSync('globalData');
let langIndex = savedGlobalData.langIndex || 0;
T.setLocaleByIndex(langIndex);
wx.T = T;

App({
  onLaunch: function () {
    var that = this


    this.globalData = savedGlobalData ||
      {
        // Language settings
        langIndex: 0,
        languages: locales,
        language: locales['zh-Hans']
      };

    // load all update in locales.js
    this.globalData.language = wx.T.getLanguage();


    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
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
              console.log(res.userInfo)
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
  login: function (callback) {
    var that = this
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'login',
      // 传给云函数的参数
      data: {

      },
      // 成功回调
      complete: res => {
        that.globalData.logined = true

        wx.setStorage({
          key: 'openid',
          data: res.result.openid,
        });
        that.globalData.openid = res.result.openid;

        callback()

      }
    })
  },

  globalData: {
    userInfo: null,
    openid: null,
    phoneNum: '',
    deliverAddress: '',
    isAdmin:false,
    logined:false,
    adminInfo:null
  }
  

})
