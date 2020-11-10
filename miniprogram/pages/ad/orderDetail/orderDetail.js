// pages/orderDetail/orderDetail.js
var mConfigs = require('../../../utils/config.js')
import event from '../../../utils/event';
//引入图片预加载组件
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
    commentData:'',
    thisItemCode:'',
    thisItemId:'',
    defaultImagePath: '../../../images/pic_160.png',
    radioItems: [
      { name: '颜色缺货', value: '0' },
      { name: '尺码缺货', value: '1', checked: true },
      { name: '其他', value: '2'},
    ],
    showInputBar:'none',
    reason_info:'',
    reason_idx:1,
    orderImgs:[],
    newPrice:0,
    dbName:'bills'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);

    wx.showLoading({
      title: '加载中...',
    })
    this.setData({ thisItemCode: options.code,thisItemId:options._id})

    this.getOrderData(options._id);
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
    wx.showLoading({
      title: '加载中...',
    })
    this.getOrderData(this.data.thisItemId);
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
  getOrderData: function (_id) {
    var that = this;
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getOne',
      // 传给云函数的参数
      data: {
        _id:_id
      },
      // 成功回调
      complete: res => {
        wx.hideLoading();
  
        if (that.isJsonString(res.result.data.bills) == false) {
          that.setData({
            orderData: res.result.data,
            bills: res.result.data.bills,
            orderImgs: res.result.data.images
          })
        } else {
          that.setData({
            orderData: res.result.data,
            bills: JSON.parse(res.result.data.bills),
            orderImgs: res.result.data.images
          })
      }
      }
    })

  },

  getItemIndex:function(index){
    this.setData({ clickedIndex:index})
  },
  setPickupCount:function(){
    let newBillItem = []
    let index = this.data.clickedIndex;
    let num = this.data.pickupNum;
    this.data.bills[index].pickupNum = num;

  },
  setPickupTime:function(){

  },
  setComment:function(){

  },

  //显示对话框
  showModal: function () {
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
  showSetXbill: function () {
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
      showSetXbillStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)

  },
  //隐藏对话框
  hideSetXbill: function () {
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
        showSetXbillStatus: false
      })
    }.bind(this), 200)

  },
  showSetBillInfo: function () {
    //隐藏一级住菜单
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
      showSetBillInfoStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)

  },
  //隐藏对话框
  hideSetBillInfo: function () {
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
        showSetBillInfoStatus: false
      })
    }.bind(this), 200)

  },
  //显示对话框
  showMenu: function (event) {
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
    this.setData({
      sliderNum: e.detail.value
    })
  },
  setPickupCount:function(){
    // 设置提货商品数量
    let newBill = this.data.bills
    newBill[this.data.clickedIndex].pickupCount = this.data.sliderNum
    this.setData({bills:newBill})

    //重新计算价格
    this.setTotalPrice()
  },
  numInputDone:function (){
    var that = this
    this.hideModal()
    this.setPickupCount()
    this.checkStatus()
    this.setItemTotalPrice(function(price){
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

    this.checkStatus();
    let newBills = this.data.bills
    newBills[this.data.clickedIndex].pickuptime = e.detail.value
    this.setData({
      bills: newBills
    })

  },
  checkStatus:function(){

    var that = this
    let idx = parseInt(this.data.clickedIndex)
    let count = parseInt(this.data.bills[idx].count)
    let pickupCount = parseInt(this.data.bills[idx].pickupCount)
    if(count===pickupCount){
      let newbills = that.data.bills
      newbills[idx].status = "1"
      newbills[idx].pickuptime = ""
      that.setData({
        bills:newbills
      })
    }else{
      let newbills = that.data.bills
      if (newbills[idx].isXbill){
        newbills[idx].status = "1"
      }else{
        newbills[idx].status = "0"
      }
  
      that.setData({
        bills: newbills
      })

    }

  },
  setItemTotalPrice: function (callback){
   
    let that = this;
    let totalPrice = 0;

    for(let i = 0;i < that.data.bills.length;i++){
      totalPrice += parseInt(that.data.bills[i].pickupCount) * parseInt(that.data.bills[i].price)
    }
    callback(totalPrice)
  },
  checkOrderType:function(){
    let that = this
    let allDone = true
    let newBills = that.data.bills
    // for (let i = 0; i <newBills.length;i++){
    //   if (parseInt(newBills[i].count) !== parseInt(newBills[i].pickupCount)){
    //     allDone = false
    //   }
    // }
    for (let i = 0; i < newBills.length; i++) {
      if (parseInt(newBills[i].status) == 0) {
        allDone = false
      }
    }
  
    if(allDone == true){
      that.data.orderData.type = '1'
    }else{
      that.data.orderData.type = '0'
    }

    that.updateToSever()
  },
  updateToSever:function(){

    wx.showLoading({
      title: '上传中...',
    })

    let that = this;

    this.data.orderData.bills = this.data.bills

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'updateOne',
      // 传给云函数的参数
      data: {
        _id: that.data.thisItemId,
        dbName:that.data.dbName,
        data: {
            bills: that.data.bills,
            type: that.data.orderData.type,
            totalPrice: that.data.orderData.totalPrice,
            isXbill: that.data.orderData.isXbill
        }
      },
      // 成功回调
      complete: res => {
        wx.hideLoading();

        if(res.result.stats.updated == 1){
          wx.showToast({
            title: '保存成功',
          })}else{
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            })

        }
        }
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
        if (res.confirm) {

          that.checkOrderType();

        } else {
        }
      }
    });
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
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.orderData.images
    wx.previewImage({
      current: this.data.orderData.images[idx],
      urls: images,
    })
  },
  radioChange: function (e) {
    let that = this

    if (e.detail.value == 0) {
      that.setData({reason_idx:0})
    }
    if (e.detail.value == 1) {
      that.setData({ reason_idx: 1 })
    }
    if (e.detail.value==2){
      that.setData({
        showInputBar:'block',
        reason_idx: 2
      })
    }else{
      that.setData({
        showInputBar: 'none'
      })
    }

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  //接受处理原因input值
  getInputInfo: function (e) {
    this.setData({ reason_info: e.detail.value })
  },
  setXbill:function(){
    this.hideSetXbill()
    let that = this
    let info = ''
    //标注特殊订单处理原因
    let idx = that.data.reason_idx
    if(idx == 2){
      info = that.data.reason_info
    }else{
      info = that.data.radioItems[idx].name
    }

    //添加处理原因到客户备注信息
    let newBills = that.data.bills
    newBills[that.data.clickedIndex].xMsg = info
    newBills[that.data.clickedIndex].pickuptime = ''

    //标注特殊订单为完成状态
    newBills[that.data.clickedIndex].status = "1"

    //在订单条目中标注特殊订单为特殊订单
    newBills[that.data.clickedIndex].isXbill = true


    let newOrderData = this.data.orderData
    newOrderData.bills = newBills

    //在订单列表中添加特殊订单标识
    newOrderData.isXbill = true

    that.setData({ bills: newBills, orderData: newOrderData })
  
    wx.showToast({
      title: '设置成功',
    })
  },
  editBillInfo:function(e){
    let newPrice = e.detail.value.price
    this.hideSetBillInfo()

    let newInfo = this.data.bills
    newInfo[this.data.clickedIndex].price = newPrice
    let newOrderData = this.data.orderData
    newOrderData.bills = newInfo
    this.setData({
      bills: newInfo,
      orderData: newOrderData
    })

    //重新计算价格
    this.setTotalPrice()

    wx.showToast({
      title: '设置成功',
    })
  },
  initBillItem:function(){

    this.hideMenu()

    let newInfo = this.data.bills
    let itemIdx = this.data.clickedIndex
    newInfo[itemIdx].pickuptime = ''
    newInfo[itemIdx].xMsg = ''
    newInfo[itemIdx].status = "0"
    newInfo[itemIdx].pickupCount = 0
    this.setData({bills:newInfo})
    wx.showToast({
      title: '初始化成功',
    })
  },
  setTotalPrice:function(){//计算总价格
    let newInfo = this.data.bills
    let totalPrice = 0
    for(let i= 0;i<newInfo.length;i++){
      totalPrice += (parseInt(newInfo[i].price) * parseInt(newInfo[i].pickupCount))
    }
    let newOrderData = this.data.orderData
    newOrderData.totalPrice = totalPrice
    this.setData({orderData:newOrderData})
  },
  setLanguage() {
    let that = this
    this.setData({
      language: wx.T.getLanguage()
    })
  }
})