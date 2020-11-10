Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 0,
    pageSize: 10,
    dbName: 'adminlist',
    adminData: []
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

  },
  getData: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'pagination',
      // 传给云函数的参数
      data: {
        dbName: that.data.dbName,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize
      },
      // 成功回调
      complete: res => {
        console.log('admin get order data is =》');
        console.log(res);
        wx.hideLoading();
        if (res.result != null) {

          let _data = that.data.adminData
          if (_data) { //newOrderData不为空
            _data = _data.concat(res.result.data)
          } else {
            _data = res.result.data
          }
          that.setData({
            adminData: _data,
          })
        } else {
          wx.showToast({
            title: '没有更多数据了',
          })
        }
        that.data.pageIndex += 1
      }
    })
  }
})