// pages/login/login.js
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getUserInfo()
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        if(res.data){
          that.getAdminInfo(res.data)
        }else{
          that.directTo(false)
        }
      },
      fail: function(res) {
        that.directTo(false)
      },
      complete: function(res) {},
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  getUserInfo:function(){
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
  directTo:function(isAdmin){
    if(isAdmin == true){
      wx.redirectTo({
        url: '../ad/index/index',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }else{
      wx.switchTab({
        url: '../order/order',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

    }
  },
  getAdminInfo:function(openid){//确定是否是管理员
    var that = this
    const db = wx.cloud.database()
    db.collection('adminlist').where({
      _openid: openid,
    })
      .get({
        success:function(res){
          if(res.data.length>0){
            app.globalData.isAdmin = true
            wx.setStorage({
              key: "adminInfo",
              data: res.data[0]
            })

            wx.setStorage({
              key: "isAdmin",
              data: true
            })

            that.directTo(true)
          }else{
            wx.setStorage({
              key: "isAdmin",
              data: false
            })
            that.directTo(false)
          }
        },
        fail: function(err){
          wx.hideLoading()
     
          wx.showToast({
            title: '登陆失败',
          })

          that.directTo(false)

          consol.log(err)
        }

      })

  },
  goTo:function(){
    if (app.globalData.logined) {
      try {
        var isAdminFlag = wx.getStorageSync('isAdmin')

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
      this.directTo(false)
    }
  }

})