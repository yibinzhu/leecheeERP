var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var mConfigs = require('../../utils/config.js')
const ImgLoader = require('../../img-loader/img-loader.js')
var app = getApp()
var userId = app.globalData.openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部订单", "已完成", "未完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    orderData: [],
  },
  onLoad: function () {
    this.imgLoader = new ImgLoader(this, this.imageOnLoad.bind(this))
    this.getOrderData();
    this.getImages();

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
    this.getOrderData();
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
  getOrderData: function () {
    wx.showLoading({
      title: '加载中...',
    })
    
    var that = this;
    
    wx.request({
      url: mConfigs.HOST_NAME + 'bill/' + userId,
      success(res) {

        wx.hideLoading();

        console.log(res.data)
        that.setData({
          orderData: res.data
        })
         console.log('order data is ' + res.data);
      }
    })
   
  },
  getImages:function(){
      let that = this
      console.log(mConfigs.HOST_NAME + 'gallerys/' + userId)
      wx.request({
        url: mConfigs.HOST_NAME + 'gallerys/' + userId,
        data: '',
        header: {},
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          console.log('images is=>')
          console.log(res.data)
          that.setData({
            imgList: res.data
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
  },
  loadImages() {
    //同时发起全部图片的加载
    this.data.imgList.forEach(item => {
      this.imgLoader.load(mConfigs.HOST_NAME+item.image)
    })
  },
  //加载完成后的回调
  imageOnLoad(err, data) {
    console.log('图片加载完成', err, data.src)

    const imgList = this.data.imgList.map(item => {
      if (item.image == data.src)
      return item
    })
    this.setData({ imgList })
  }
})