// pages/bill/bill.js
var mConfigs = require('../../utils/config.js')
import event from '../../utils/event';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billItems: [],
    orderData:{},
    bills:[],
    imgData:'',
    defaultImagePath: '../../images/pic_160.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);

    console.log(options.id);
    wx.showLoading({
      title: '加载中...',
    })
    this.getOrderData(options.code);

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
  
    const db = wx.cloud.database()
    db.collection('bills').where({
      code: code
    }).get({
      success: function (res) {
        wx.hideLoading();

        if (that.isJsonString(res.data[0].bills) == false) {
          that.setData({
            orderData: res.data,
            bills: res.data[0].bills
          })
        } else {
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
      },
    handleImagePreview(e) {
    const idx = e.target.dataset.idx
      const images = this.data.orderData[0].images
      console.log('image list')
      console.log(images)
    wx.previewImage({
      current: this.data.orderData[0].images[idx],
      urls: images,
    })
  },
  setLanguage() {
    let that = this
    this.setData({
      language: wx.T.getLanguage()
    })
  }
})