// pages/bill/bill.js
var mConfigs = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billItems: [],
    orderData:{},
    bills:[],
    imgData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    wx.showLoading({
      title: '加载中...',
    })
    this.getOrderData(options.code);
    this.getImage(options.code)
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
  getOrderData: function (code) {
    var that = this;
    wx.request({
      url: mConfigs.HOST_NAME + 'bill/detail/' + code,
      success(res) {
        wx.hideLoading();

        if (that.isJsonString(res.data[0].bills)==false){
          that.setData({
            orderData: res.data,
            bills: res.data[0].bills
          })
        }else{
          that.setData({
            orderData: res.data,
            bills: JSON.parse(res.data[0].bills)
          })
        }
    
        console.log('bills data is=>')
        console.log(res.data)

      }
    })

  },
  getImage:function(code){
    let that = this;
    wx:wx.request({
      url: mConfigs.HOST_NAME + 'gallery/' + code,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log('bill detail image=>')
        console.log(res.data)
        that.setData({
          imgData: res.data
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  previewImg: function (e) {
    let that = this;
    // console.log(e.currentTarget.dataset.index);
    // var index = e.currentTarget.dataset.index;
    // var imgArr = this.data.imgArr;
    wx.previewImage({
      current: that.data.imgData[0].image,     //当前图片地址
      urls: that.setImgList(),               //所有要预览的图片的地址集合 数组形式
      success: function (res) { 
        console.log('opened image')
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  setImgList: function () {
    let that = this;
    let imgList = [];
    for (let i = 0; i < that.data.imgData.length;i++){
        imgList.push(that.data.imgData[i].image)
      }
    return imgList;
   },

 isJsonString:function (str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
      }

})