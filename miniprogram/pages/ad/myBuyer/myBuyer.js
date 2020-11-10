// pages/ad/myBuyer/myBuyer.js
import event from '../../../utils/event';
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dbName:'user',
    _super:false,
    buyerList:[],
    pageIndex:0,
    pageSize:10,
    adminInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);

      wx.getStorage({
      key: 'adminInfo',
      success: function (res) {
        that.setData({ adminInfo: res.data })
        console.log('admin info=>' + that.data.adminInfo)
        that.getData();
      },
      fail: function (res) { that.getData(); },
      complete: function (res) { },
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

  },
  getData: function () {
    console.log('index is' + this.data.pageIndex)
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });

    let userId = app.globalData.openid
    let isadmin = ''
    try {
      var value = wx.getStorageSync('isAdmin')
      if (value) {
        // Do something with return value
        isadmin = value
      }
    } catch (e) {
      // Do something when catch error
      wx.showToast({
        title: '读取内存数据错误',
      })
    }

    let dbName = that.data.dbName
    let pageIndex = that.data.pageIndex
    let pageSize = that.data.pageSize
    let newBuyerData = that.data.buyerList
    let buyerlist = []
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'getMyBuyer',
          // 传给云函数的参数
          data: {
            dbName,
            pageIndex,
            pageSize,
            buyers: that.data.adminInfo.buyers,
          },
          // 成功回调
          complete: res => {
            console.log('admin get order data is =》');
            console.log(res);
            wx.hideLoading();
            if (res.result != null) {
              if (newBuyerData) { //newBuyerData不为空
                buyerlist = newBuyerData.concat(res.result.data)
                newBuyerData = buyerlist
              } else {
                newBuyerData = res.result.data
              }

              that.setData({
                buyerList: newBuyerData,
              })
            } else {
              wx.showToast({
                title: '没有更多数据了',
              })
            }
          }
        })

        that.data.pageIndex += 1
      },
  checkboxChange: function (e) {
    this.data.checkboxClicked = true
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var buyerList = this.data.buyerList, values = e.detail.value;
    for (var i = 0, lenI = buyerList.length; i < lenI; ++i) {
      buyerList[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (buyerList[i]._openid == values[j]) {
          buyerList[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      buyerList: buyerList
    });
  },
  //显示对话框
  showMenu: function (event) {
    console.log('Menu showed')
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
  showDelConfirm: function () {
    let that = this
    if (this.data.pickerCheckClicked == false) {
      wx.showToast({
        title: '请选择用户',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定删除用户吗？',
        success: function (sm) {
          if (sm.confirm) {
            that.delUsers()
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  delUsers: function () {
    let that = this
    if (this.data.pickerCheckClicked == false) {
      wx.showToast({
        title: '请选择用户',
      })
    } else {
      let data = that.data.buyerList
      for (let i = 0; i < data.length; i++) {
        if (data[i].checked == true) {
          //删除订单列表数组中的数据
          let _user = data[i]

          data.splice(i, 1)
        }
      }
      that.setData({
        buyerList: data
      })
      //在列表中删除用户之后,将更新后的buyer字段更新的数据库
      that.doDel()
      that.hideMenu()
    }
  },
  doDel: function () {
    let that = this
    let buyerList = that.data.buyerList
    let id = that.data.adminInfo._id
    //更新数据库中的数据
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'updateOne',
      // 传给云函数的参数
      data: {
        dbName: 'adminlist',
        _id: id,
        data: { buyerList: buyerList}
      },
      // 成功回调
      complete: res => {
        console.log('update res =》');
        console.log(res);
        if(res.result.stats.updated == 1){
          wx.showToast({
            title: '删除成功',
          })
        }
      }
    })
  },
  addMark:function(event){
    let openid = event.currentTarget.dataset.openid
    console.log('dataset')
    console.log(event)
    wx.navigateTo({
      url: '../settingMark/settingMark?openid=' + openid,
    })
  },
  setLanguage() {
    let that = this
    this.setData({
      language: wx.T.getLanguage()
    })
  }
})