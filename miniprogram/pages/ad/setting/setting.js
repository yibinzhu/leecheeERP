// pages/setting/setting.js
import event from '../../../utils/event';
var _super = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _super:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);

    wx.getStorage({
      key: 'super',
      success: function(res) {
        that.setData({ _super: res.data})
      },
      fail: function(res) {},
      complete: function(res) {},
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
  logoutConfirm:function(){
    var that = this
    wx.showModal({
      title: '退出登陆',
      content: '确定退出登陆吗？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.logout()
        } else {
          return;
        }
      }
    })
  },
  logout:function(){
    wx.showLoading({
      title: '正在退出..',
    })
  wx.setStorage({
      key: 'isAdmin',
      data: 'false',
    })

    setTimeout(()=>{
      wx.hideLoading()
      wx.switchTab({
        url: '../../order/order',
      })
    },1500)
  },
  //显示对话框
  showModal: function () {
    console.log('modal showed')
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
  formSubmit(e) {
    let that = this
    let psword = e.detail.value.password;
    if(psword == 'weilelianmeng'){
      wx.setStorage({
        key:'super',
        data:true
      })
      wx.showToast({
        title: '设置成功！',
      })
    that.setData({_super:true})
    }else{
      wx.showToast({
        title: '密码错误！',
      })
    }
    this.hideModal()
    },
  clearStorge:function(){
    wx.clearStorage()
    wx.showToast({
      title: '清除缓存完成',
    })
  },
  clearStorageConfirm:function(){
    var that = this
    wx.showModal({
      title: '清除缓存',
      content: '确定清除缓存吗？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          that.clearStorge()
        } else {
          return;
        }
      }
    })
  },
  setLanguage() {
    let that = this
    this.setData({
      language: wx.T.getLanguage()
    })
    
  }
})