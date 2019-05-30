//index.js
//获取应用实例
const app = getApp()
var mLogin = require('../../module/login.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phoneNum:'',
    deliverAddress:''
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  saveDeliverAddress:function(e){
    let value = e.detail.value;
    console.log('address is ' + value)
    this.setData({
      deliverAddress:value,
    })
    app.globalData.deliverAddress = value;
  },
  savePhoneNum: function (e) {
    let value = e.detail.value;
    console.log('phone num is '+value)
    this.setData({
      phoneNum: value,
    })
    app.globalData.phoneNum = value;
  },

  alertSave:function(event){
    console.log(event);
    var that = this;
    let flag = event.currentTarget.dataset.flag
    console.log('flag is=》'+flag);
    switch(flag){
      case '0':
        if(that.data.phoneNum == ''){
          wx.showToast({
            title: '请填写电话',
          })
        }else{
          wx.showToast({
            title: '保存成功',
          })
        }
        break;
      case '1':
        if (that.data.deliverAddress == '') {
          wx.showToast({
            title: '请填写地址',
          })
        } else {
          wx.showToast({
            title: '保存成功',
          })
        }
        break;
    }
   
  },
  login:function(){
    mLogin.login()
  }

})
