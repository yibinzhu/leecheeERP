// pages/orderDetail/orderDetail.js
var mConfigs = require('../../utils/config.js')
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bills:[],
    clickedIndex:0,
    pickupNum:0,
    min: '0',
    max: '10',
    sliderNum:0,
    text: '',
    showPickupDate:false,
    actionSheetHidden:true,
    itemTotalPrice:0,
    imgUrl:'',
    gallerys:[],
    hostname: mConfigs.HOST_NAME,
    imgUrlOriginal:'',
    orderData:'',
    commentData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //初始化图片预加载组件
    this.imgLoader = new ImgLoader(this)

    console.log('code is'+options.code);
    wx.showLoading({
      title: '加载中...',
    })
    this.getOrderData(options.code);
    this.getImages(options.code);
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
  getOrderData: function (code) {
    var that = this;
    wx.request({
      url: mConfigs.HOST_NAME + 'bill/detail/' + code,
      success(res) {
        console.log('res data is');
        console.log(res.data);
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

      }
    })
  },

  getItemIndex:function(index){
    console.log('clicked index is'+index);
    this.setData({ clickedIndex:index})
  },
  setPickupCount:function(){
    let newBillItem = []
    let index = this.data.clickedIndex;
    let num = this.data.pickupNum;
    this.data.bills[index].pickupNum = num;
    
    console.log('picknum this ' + this.data.bills[index].pickupNum);


  },
  setPickupTime:function(){

  },
  setComment:function(){

  },

  //显示对话框
  showModal: function () {
    console.log('modal showed')

    this.hideMenu()

    this.setSliderMax()
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)

  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)

  },
  showComment: function () {
    console.log('Comment showed')

    this.hideMenu()

    this.setSliderMax()
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showCommentStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)

  },
  //隐藏对话框
  hideComment: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showCommentStatus: false
      })
    }.bind(this), 200)

  },
  //显示对话框
  showMenu: function (event) {
    console.log('Menu showed')
    // 设置点击条目序号
    this.getItemIndex(event.currentTarget.dataset.index);

    this.setSliderMax()
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showMenuStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)

  },
  //隐藏对话框
  hideMenu: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      comment_textarea_disable: 'false'
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showMenuStatus: false
      })
    }.bind(this), 200)

  },
  getSliderNum:function(e){
    // 获取slider数值
    console.log(' num is' + e.detail.value)
    this.setData({
      sliderNum: e.detail.value
    })
  },
  setPickupCount:function(){
    // 设置提货商品数量
    let newBill = this.data.bills
    newBill[this.data.clickedIndex].pickupCount = this.data.sliderNum
    this.setData({bills:newBill})
    console.log(this.data.bills)
  },
  numInputDone:function (){
    var that = this
    this.hideModal()
    this.setPickupCount()
    this.checkStatus()
    this.setItemTotalPrice(function(price){
      console.log('callback'+price)
      that.setData({ itemTotalPrice: price })
    })
  },
  setSliderMax:function(){
    let max = this.data.bills[this.data.clickedIndex].count
    this.setData({max:max})
  },
  setPickupDate:function(){

  },
  bindDateChange: function (e) {

    this.hideMenu()

    console.log('date is' + e.detail.value)

    this.checkStatus();
    let newBills = this.data.bills
    newBills[this.data.clickedIndex].pickuptime = e.detail.value
    this.setData({
      bills: newBills
    })

    console.log(this.data.bills)
  },
  checkStatus:function(){
    console.log('check status')
    var that = this
    let idx = parseInt(this.data.clickedIndex)
    let count = parseInt(this.data.bills[idx].count)
    let pickupCount = parseInt(this.data.bills[idx].pickupCount)
    if(count===pickupCount){
      let newbills = that.data.bills
      newbills[idx].status = 1
      newbills[idx].pickuptime = ""
      that.setData({
        bills:newbills
      })
    }else{
      let newbills = that.data.bills
      newbills[idx].status = 0
      that.setData({
        bills: newbills
      })
    }

    console.log(this.data.bills[idx])
  },
  setItemTotalPrice: function (callback){
   
    let that = this;
    let totalPrice = 0;

    for(let i = 0;i < that.data.bills.length;i++){
      totalPrice += parseInt(that.data.bills[i].pickupCount) * parseInt(that.data.bills[i].price)
      console.log('price is' + totalPrice)
    }
    callback(totalPrice)
    console.log('price counted' + totalPrice)
  },
  checkOrderType:function(){
    let that = this
    let allDone = true
    let newBills = that.data.bills
    for (let i = 0; i <newBills.length;i++){
      if (parseInt(newBills[i].count) !== parseInt(newBills[i].pickupCount)){
        allDone = false
      }
    }
    console.log('that.orderData')
    console.log(that.data.orderData)
    console.log('allDone' + allDone)
    if(allDone == true){
      that.data.orderData[0].type = "1"
    }else{
      that.data.orderData[0].type = "0"
    }
  },
  updateToSever:function(){
    let that = this;
    this.checkOrderType();
    this.data.orderData[0].bills = this.data.bills
    console.log(this.data.orderData)

    wx: wx.request({
      url: mConfigs.HOST_NAME + 'bill/update',
      data: that.data.orderData,
      header: {},
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '保存成功',
        })
      
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  openConfirm: function () {
    let that = this
    wx.showModal({
      title: '保存订单',
      content: '是否保存订单数据',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.updateToSever()
        } else {
          console.log('用户点击辅助操作')
        }
      }
    });
  },
  getImages: function (code) {
    let that = this
    console.log(mConfigs.HOST_NAME + 'gallery/' + code)
    wx.request({
      url: mConfigs.HOST_NAME + 'gallery/'+code,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      // responseType: 'text',
      success: function (res) {
        console.log('images is=>')
     
        console.log(res.data[0])
        let str_img = res.data[0].image.replace(/\\/g, "/")
        console.log(str_img)
        that.setData({
          gallerys: res.data,
          imgUrl: mConfigs.HOST_NAME + str_img
        })
       },
      fail: function (res) { },
      complete: function (res) { },
    })

    // //加载缩略图
    // this.setData({
    //   msg: '大图正在拼命加载..',
    //   imgUrl: imgUrlThumbnail
    // })

    // //同时对原图进行预加载，加载成功后再替换
    // this.imgLoader.load(this.data.imgUrlOriginal, (err, data) => {
    //   console.log('图片加载完成', err, data.src)

    //   if (!err)
    //     this.setData({ imgUrl: data.src })
    // })

  },
  getComment: function (e) { 
    this.setData({
      commentData: e.detail.value
    });
  },
  isJsonString: function (str) {
    try {
      if (typeof JSON.parse(str) == "object") {
        return true;
      }
    } catch (e) {
    }
    return false;
  }

})