//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    // if (!wx.cloud) {
    //   wx.redirectTo({
    //     url: '../chooseLib/chooseLib',
    //   })
    //   return
    // }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    if (app.globalData.logined) {
      try {
        var isAdminFlag = wx.getStorageSync('isAdmin')
        console.log('storage isAdmin value is ' + isAdminFlag)
        if (isAdminFlag) {
          this.directTo(true)
        } else {
          this.directTo(false)
        }
      } catch (e) {
        // Do something when catch error
        console.log(e)
      }


    } else {
      this.login()
    }
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  login: function () {
    var that = this

    wx.showLoading({
      title: '加载中...',
    })


    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'login',
      // 传给云函数的参数
      data: {

      },
      // 成功回调
      complete: res => {
        app.globalData.logined = true

        console.log('global logined value is' + app.globalData.logined)
        console.log('openid is' + res.result.openid)

        wx.setStorage({
          key: 'openid',
          data: res.result.openid,
        });
        app.globalData.openid = res.result.openid;

        that.getAdminInfo(res.result.openid)

      }
    })

  },
  directTo: function (isAdmin) {
    if (isAdmin == true) {
      wx.redirectTo({
        url: '../ad/admin/admin',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.switchTab({
        url: '../order/order',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    }
  },
  getAdminInfo: function (openid) {
    var that = this
    const db = wx.cloud.database()
    db.collection('adminlist').where({
      user: openid,
    })
      .get({
        success: function (res) {
          wx.hideLoading()
          console.log('get admin info=>')
          console.log(res)
          if (res.data.length > 0) {
            app.globalData.isAdmin = true
            console.log('user is admin')
            wx.setStorage({
              key: "isAdmin",
              data: true
            })

            that.directTo(true)
          } else {
            console.log('user is not admin')
            wx.setStorage({
              key: "isAdmin",
              data: false
            })
            that.directTo(false)
          }
        },
        fail: function (err) {
          wx.hideLoading()

          wx.showToast({
            title: '登陆失败',
          })

          that.directTo(false)

          consol.log(err)
        }

      })

  }
  

})
