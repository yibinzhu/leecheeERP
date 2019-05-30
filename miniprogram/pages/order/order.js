import { $init, $digest } from '../../utils/common.util'
var mUploadImg = require("../../module/uploadImg.js")
var util = require("../../utils/util.js")
var mConfigs = require('../../utils/config.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    bills: [],
    building: ['OT', 'APM', 'UUS', '其他'],
    buildingIndex: 0,// 0:ot 1:apm 2:uus 3:其他
    billItem: { itemid: '', color: '', size: '', count: '', price: '', status: 0, pickuptime: '',totalPrice: 0},
    input_color: '',
    input_size: '',
    input_count: '',
    input_price: '',
    store_address: '',
    comment: '',
    service_type: '',
    comment_placeholder: '备注信息',
    showMask: false,
    radioItems: [
      { name: '补款', value: '0', checked: false },
      { name: '代取货', value: '1', checked: true }
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  openSuccess: function () {
    wx.navigateTo({
      url: 'msg_success'
    })
  },
  openFail: function () {
    wx.navigateTo({
      url: 'msg_fail'
    })
  },
  checkInput: function () {
    if ((this.data.pics).length == 0) {
      return 0 //未上传图片
      console.log('pics is null');
    }
    if ((this.data.bills.length) == 0) {
      return 1 //未添加商品信息
      console.log('bills is null');
    }
    if (!this.data.store_address) {
      return 2 //未添加地址
    }
    return 3
  },
  bindBuildingChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      buildingIndex: e.detail.value
    })
  },
  getAddress: function (e) {
    console.log('address is =>' + e.detail.value);
    this.setData({
      store_address: e.detail.value
    })
  },
  getComment: function (e) {
    this.setData({
      comment: e.detail.value
    });
  },
  reset: function () {
    this.setData({
      bills: [],
      pics: [],
      store_address: '',
      input_color: '',
      input_size: '',
      input_count: '',
      input_price: '',
      comment: ''
    })
  },
  removeBillItem: function (e) {
    let newBills = [];
    const idx = e.target.dataset.idx;
    console.log('index is ' + idx);
    const delItem = this.data.bills.splice(idx, 1);
    for (let i = 0; i < this.data.bills.length; i++) {
      if (this.data.bills[i].color == delItem.color && this.data.bills[i].size == delItem.size) {
        continue;
      } else {
        newBills.push(this.data.bills[i]);
      }
    }
    this.setData({ bills: newBills });
    console.log(this.data.bills);
  },
  dialog_delBillItem: function (e) {
    var that = this;
    wx.showModal({
      title: '删除此条目',
      content: '是否删除此条目？',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.removeBillItem(e);
        } else {
          return;
        }
      }
    });
  },
  formReset() { //清空商品信息
    this.setData({
      input_color: '',
      input_size: '',
      input_count: '',
      input_price: '',
    })
  },

  formSubmit(e) { //提交商品信息
    let newData = [];
    let itemIndex = 0;
    let item_color = e.detail.value.color;
    let item_size = e.detail.value.size;
    let item_count = e.detail.value.count;
    let item_price = e.detail.value.price;

    if (item_color.length > 0 && item_size.length && item_count.length && item_price.length) {

// 创建商品信息，并加入商品列表
      let newBillItem = {};
      newBillItem.index = itemIndex;
      newBillItem.color = item_color;
      newBillItem.size = item_size;
      newBillItem.count = item_count;
      newBillItem.pickupCount = 0;
      newBillItem.price = item_price;
      newBillItem.status = 0;
      newBillItem.pickuptime = '';
      let totalPrice = parseInt(item_count) * parseInt(item_price);
      newBillItem.totalPrice = totalPrice;

      newData = this.data.bills;
      newData.push(newBillItem)
   
      this.setData({ bills: newData });
      this.formReset();

    } else {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'success',
        duration: 1000
      });
    }
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.pics

    wx.previewImage({
      current: this.data.pics[idx],
      urls: images,
    })
  },

  removeImage(e) { //删除选中图片
    var newPics = [];
    const idx = e.target.dataset.idx;
    const delPic = this.data.pics.splice(idx, 1);
    for (var i = 0; i < this.data.pics.length; i++) {
      if (this.data.pics[i] == delPic) {
        continue;
      } else {
        newPics.push(this.data.pics[i]);
      }
    }
    this.setData({ pics: newPics })
  },
  dialog_delImg: function (e) {
    var that = this;
    wx.showModal({
      title: '删除图片',
      content: '是否删除图片？',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.removeImage(e);
        } else {
          return;
        }
      }
    });
  },
  catchTouch: function () {
    return;
  },
  //点击我显示底部弹出框
  addGoodsInfo: function () {
    this.showModal();
  },

  //显示对话框
  showModal: function () {
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

    //隐藏输入栏
    this.setData({
      showMask: true
    })
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
      comment_textarea_disable: 'false'
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)

    //显示输入栏
    this.setData({
      showMask: false
    })
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      service_type: e.detail.value
    });
  },

  chooseImg: function () {
    var that = this,
      pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  openToast: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'warning',
      duration: 3000
    });
  },
  readyToUpload: function () {

    console.log(util.createOrderNumber(this.data.buildingIndex));

    let flag = this.checkInput();

    if (flag == 0) {
      this.openToast('请填加图片');
    }
    else if (flag == 1) {
      this.openToast('请填写商品信息');
    }
    else if (flag == 2) {
      this.openToast('请填写地址');
    }
    else {
      var that = this;
      wx.showModal({
        title: '上传图片',
        content: '是否上传图片？',
        confirmText: "是",
        cancelText: "否",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            that.uploadimg();
          } else {
            return;
          }
        }
      });
    }

  },
  uploadimg: function () {//这里触发图片上传的方法
    let userId = app.globalData.openid

    if(userId == null){
     wx.showToast({
       title: '请先登陆',
       icon: '',
       image: '',
       duration: 0,
       mask: true,
       success: function(res) {},
       fail: function(res) {},
       complete: function(res) {},
     })
      return
    }
    wx.showLoading({
      title: '上传中...',
      mask: true
    })

// 上传商品信息
    let code = util.createOrderNumber(this.data.buildingIndex);//生成订单号码

    let dataBody = {
      code: '',
      type:'' ,
      bills: [],
      totalPrice:0,
      totalCount:0,
      address: '',
      comment: '',
      user:'',
      time:'',
      images:[]
    }

    dataBody.code = code;
    dataBody.type = mConfigs.ORDER_UNDONE;
    dataBody.bills = JSON.stringify(this.data.bills);
 
    let priceItem = 0;
    // 计算订单总价格
    for(var i = 0;i<this.data.bills.length;i++){
      priceItem += parseInt(this.data.bills[i].totalPrice);
    }

    dataBody.totalPrice = priceItem;

    let countItem = 0;
    for (var i = 0; i < this.data.bills.length; i++) {
      countItem += parseInt(this.data.bills[i].count);
    }
    dataBody.totalCount = countItem;

    dataBody.address = this.data.building[this.data.buildingIndex] + " "+this.data.store_address;
    dataBody.comment = this.data.comment;
    dataBody.user = userId;
    var myDate = new Date()
    let orderTime = util.formatTime(myDate);
    dataBody.time = orderTime
    console.log('databody is=>' + JSON.stringify(dataBody));
    
    this.onAdd(dataBody)

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.pics // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this);
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })

  },
  onAdd: function (uploadData) {
    var that = this
    const db = wx.cloud.database()
    db.collection('bills').add({
      data:uploadData,
      success: res => {

        // 上传商品图片
        var pics = that.data.pics;
        let user = app.globalData.openid;
        mUploadImg.uploadimg({
          path: pics,//这里是选取的图片的地址数组
          code: uploadData.code,
          user: user,
          ordertime: uploadData.orderTime,
        });

        this.reset();


        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '上传成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '上传失败'
        })
      }
    })
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