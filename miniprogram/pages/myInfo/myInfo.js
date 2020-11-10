// pages/myInfo/myInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  openConfirm: function () {
    let that = this
    wx.showModal({
      title: '保存信息',
      content: '是否保存个人信息',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
        that.update(that.data.userInfo)
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  },
  update:function(_data){
    let _openid = ''
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        _openid = res.data
      },
    })
    const db = wx.cloud.database()
    db.collection('user').doc(_openid).update({
      // data 传入需要局部更新的数据
      data: _openid,
      success: function(res){
        wx.showToast({
          title: '保存成功',
        })
      },
      fail: console.error
    })
  },
  formSubmit(e) { //提交商品信息
    let that = this

    let _userInfo = that.data.userInfo
    _userInfo.name = e.detail.value.name
    _userInfo.country = e.detail.value.country
    _userInfo.phone = e.detail.value.phone
    _userInfo.address = e.detail.value.address
    _userInfo.detail = e.detail.value.detail

    that.setData({
      userInfo:_userInfo
    })

    that.openConfirm()

  }
})