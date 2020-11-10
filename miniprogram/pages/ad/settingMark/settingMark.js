// pages/ad/settingMark/settingMark.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('openid from mybuys is' + options.openid);
    this.setData({ openid: options.openid})
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
  formSubmit(e) {
    let mark = e.detail.value.mark
    let des = e.detail.value.des
    let openid = that.data.openid

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'col-update',
      // 传给云函数的参数
      data: {
        dbName: 'user',
        _openid: openid,
        data: { mark,des }
      },
      // 成功回调
      complete: res => {
        console.log('update res =》');
        console.log(res);
        if (res.result.stats.updated == 1) {
          wx.showToast({
            title: '保存成功',
          })
        }
      }
    })

    }
})