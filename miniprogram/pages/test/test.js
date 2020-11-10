// pages/test/test.js
import event from '../../utils/event'
let globalData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    language: '',
    languages: ['简体中文', '한국어'],
    langIndex: 0,

    nav_url:'/pages/ad/orderDetail/orderDetail',
    orderData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      langIndex: globalData.langIndex,
      logged: globalData.logged,
      stuId: globalData.stuId,
      stuName: globalData.stuName,
      loading: false
    });

    this.setLanguage();

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
  columnchange:function(e) {
    console.log('column is=>' + e.detail.column)   // {column: 2, value: 1}
    switch (e.detail.column) { // 此时的改变列数
      case 0:
        // 处理逻辑
        break;
      case 1:
        //  处理逻辑
        break;
    }
    this.setData({
      // 更新数据
    })
  },
  pickchange:function(e) { // picker发送选择改变时候触发 通过e.detail.value获取携带的值   //   [0,1,2]   
    console.log('e.detail.value获取携带的值=>'+e.detail.value)
  this.setData({
    multiIndex: e.detail.value  // 直接更新即可
  })
},
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['B2F','B1F', '1F', '2F', '3F', '4F', '5F'];
            break;
          case 1:
            data.multiArray[1] = ['1F', '2F', '3F', '4F', '5F', '6F', '7F',];
            break;
          case 2:
            data.multiArray[1] = ['1F', '2F', '3F', '4F', '5F', '6F', '7F',];
            break;
          case 3:
            data.multiArray[1] = ['1F', '2F', '3F', '4F', '5F', '6F', '7F',];
            break;
          case 4:
            data.multiArray[1] = [''];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    console.log(data.multiIndex);
    this.setData(data);
  },
  getData:function(){
    let that = this
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'com-or',
      // 传给云函数的参数
      data: {
        pageIndex:0,
        pageSize:10,
        dbName: 'test',
        data: [{ _openid: 'oEhe55fiwdjz8hxfQHUjhjNFUPQw' }, { _openid: 'oEhe55fy-c34CbcrcXQNsDEUL0QU' }]
        // data: [{ _openid: 'oEhe55fy-c34CbcrcXQNsDEUL0QU'}]
      },
      // 成功回调
      complete: res => {
        console.log('res =》');
        console.log(res.result);
        this.setData({ orderData: res.result.data})
      }
    })
  },
  getStatasInfo:function(){
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getStatasInfo',
      // 传给云函数的参数
      data: {
        dbName: 'bills',
        // buyers: [{ _openid: 'oEhe55fiwdjz8hxfQHUjhjNFUPQw' }, { _openid: 'oEhe55fy-c34CbcrcXQNsDEUL0QU' }],
        buyers: [{ _openid: 'oEhe55fiwdjz8hxfQHUjhjNFUPQw' }],
      },
      // 成功回调
      complete: res => {
        console.log('res =》');
        console.log(res);
      }
    })
  },
  getOrderInfo:function(){
    let user = {}
    user.nickName = 'nick'
    user.gender = 'male'
    user.avatarUrl = 'that.data.userInfo.avatarUrl'
    user.openid = 'res.result.openid'

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'addUser',
      // 传给云函数的参数
      data: {
        dbName:'user',
        data: user
      },
      // 成功回调
      complete: res => {
        console.log('admin get order data is =》');
        console.log(res);
      }
    })
  },
  changeLanguage(e) {
    let index = e.detail.value;
    this.setData({
      langIndex: index
    });
    wx.T.setLocaleByIndex(index);
    this.setLanguage();
    event.emit('languageChanged');

    globalData.langIndex = this.data.langIndex;
    globalData.language = globalData.languages[wx.T.langCode[this.data.langIndex]];
  },
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    wx.T.setTabBarLang(this.data.langIndex);
    wx.T.setNavigationBarTitle();
  },
})