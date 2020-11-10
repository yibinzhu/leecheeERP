// pages/ad/xOrderList/xOrderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_url: '/pages/ad/orderDetail/orderDetail',
  },
  getData: function () {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'searchOrder',
      // 传给云函数的参数
      data: {
        dbName: 'bills',
        option: {isXbill:true}
      },
      // 成功回调
      complete: res => {
        console.log('order data is =》');
        console.log(res);
        wx.hideLoading();
        if (res.result) {
          that.setData({
            orderData: res.result.data
          })
        } else {
          wx.showToast({
            title: '没有此订单',
            icon:'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
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

  }
})