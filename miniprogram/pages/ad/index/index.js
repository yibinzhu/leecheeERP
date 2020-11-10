//index.js
//获取应用实例
import event from '../../../utils/event';
const app = getApp()
var sliderWidth = 96;
Page({
  data: {
    tabs: ["全部", "未完成", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    PageCur: 'orderList',
    dbName:'bills',
    pageSize:10,
    pageIndex:0,
    orderData:[],
    allOrderData:[],
    doneOrderData:[],
    undoneOrderData:[],
    allPageIndex:0,
    donePageIndex:0,
    undonePageIndex:0,
    nav_url: '/pages/ad/orderDetail/orderDetail',
    languages: ['简体中文', '한국어'],
    langIndex: 0,
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.initset();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //防止在设置页面中下拉到底加载
    if (this.data.PageCur == 'setting') {
      return
    }
    this.getData();
  },
  //事件处理函数
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  initset: function () {
    let that = this
    let idx = that.data.activeIndex
    if(idx == 0){
      that.data.allPageIndex = 0
      that.data.allOrderData = []
    }
    if (idx == 1) {
      that.data.undonePageIndex = 0
      that.data.undoneOrderData = []
    }
    if (idx == 2) {
      that.data.donePageIndex = 0
      that.data.doneOrderData = []
    }
    this.getData();
  },
  onLoad: function () {
    var that = this;

    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);

    wx.getStorage({
      key: 'super',
      success: function (res) {
        that.setData({ _super: res.data })
        that.getData();
      },
      fail: function (res) { that.getData(); },
      complete: function (res) { },
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

  },
  getData: function () {
    let that = this;
    let s = that.data._super
    let activeIndex = this.data.activeIndex
    if (activeIndex == 0) {
      that.getAll(s)
    } 
    if (activeIndex == 1){
      that.getUndone(s)
    } 
    if (activeIndex == 2){
      that.getDone(s)
    }
  },
  getAll:function(s){
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
        icon: 'none'
      })
    }

    let dbName = that.data.dbName
    let pageIndex = that.data.allPageIndex
    let pageSize = that.data.pageSize
    let newOrderData = that.data.allOrderData
    let orderlist = []
    let adminInfo = wx.getStorageSync('adminInfo')
    let buyer = adminInfo.buyers
    if (isadmin) {
      if (s) {
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'getOrderInfo',
          // 传给云函数的参数
          data: {
            dbName,
            pageIndex,
            pageSize,
            buyers: [{}],
            type: {}
          },
          // 成功回调
          complete: res => {
            wx.hideLoading();
            console.log('get all res')
            console.log(res.result.data)
            if (res.result != null) {
              if (newOrderData) { //newOrderData不为空
                orderlist = newOrderData.concat(res.result.data)
                newOrderData = orderlist
              } else {
                newOrderData = res.result.data
              }

              that.setData({
                allOrderData: newOrderData,
              })
            } else {
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none'
              })
            }
          }
        })

        that.data.allPageIndex += 1
      } else {
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'getOrderInfo',
          // 传给云函数的参数
          data: {
            dbName,
            pageIndex,
            pageSize,
            buyers: buyer,
            type: {}
          },
          // 成功回调
          complete: res => {
            wx.hideLoading();
            if (res.result != null) {
              if (newOrderData) { //newOrderData不为空
                orderlist = newOrderData.concat(res.result.data)
                newOrderData = orderlist
              } else {
                newOrderData = res.result.data
              }

              that.setData({
                allOrderData: newOrderData,
              })
            } else {
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none'
              })
            }
          }
        })

        that.data.allPageIndex += 1
      }

    } else {
      wx.showToast({
        title: '管理员身份认证错误',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../my/my'
        })
      }, 1500)
    }
  },
  getUndone:function(s){
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
        icon: 'none'
      })
    }

    let dbName = that.data.dbName
    let pageIndex = that.data.undonePageIndex
    let pageSize = that.data.pageSize
    let newOrderData = that.data.undoneOrderData
    let orderlist = []
    if (isadmin) {
      if (s) {
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'getOrderInfo',
          // 传给云函数的参数
          data: {
            dbName,
            pageIndex,
            pageSize,
            buyers: [{}],
            type: { type: "0" }
          },
          // 成功回调
          complete: res => {
            wx.hideLoading();
            if (res.result != null) {
              if (newOrderData) { //newOrderData不为空
                orderlist = newOrderData.concat(res.result.data)
                newOrderData = orderlist
              } else {
                newOrderData = res.result.data
              }

              that.setData({
                undoneOrderData: newOrderData,
              })
            } else {
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none'
              })
            }
          }
        })

        that.data.undonePageIndex += 1
      } else {
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'getOrderInfo',
          // 传给云函数的参数
          data: {
            dbName,
            pageIndex,
            pageSize,
            buyers: app.globalData.adminInfo.buyers,
            type: { type: "0" }
          },
          // 成功回调
          complete: res => {
            wx.hideLoading();
            if (res.result != null) {
              if (newOrderData) { //newOrderData不为空
                orderlist = newOrderData.concat(res.result.data)
                newOrderData = orderlist
              } else {
                newOrderData = res.result.data
              }

              that.setData({
                undoneOrderData: newOrderData,
              })
            } else {
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none'
              })
            }
          }
        })

        that.data.undonePageIndex += 1
      }

    } else {
      wx.showToast({
        title: '管理员身份认证错误',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../my/my'
        })
      }, 1500)
    }
  },
  getDone:function(s){
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
        icon: 'none'
      })
    }

    let dbName = that.data.dbName
    let pageIndex = that.data.donePageIndex
    let pageSize = that.data.pageSize
    let newOrderData = that.data.doneOrderData
    let orderlist = []
    if (isadmin) {
      if (s) {
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'getOrderInfo',
          // 传给云函数的参数
          data: {
            dbName,
            pageIndex,
            pageSize,
            buyers: [{}],
            type: { type: "1" }
          },
          // 成功回调
          complete: res => {
            wx.hideLoading();
            if (res.result != null) {
              if (newOrderData) { //newOrderData不为空
                orderlist = newOrderData.concat(res.result.data)
                newOrderData = orderlist
              } else {
                newOrderData = res.result.data
              }

              that.setData({
                doneOrderData: newOrderData,
              })
            } else {
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none'
              })
            }
          }
        })

        that.data.donePageIndex += 1
      } else {
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'getOrderInfo',
          // 传给云函数的参数
          data: {
            dbName,
            pageIndex,
            pageSize,
            buyers: app.globalData.adminInfo.buyers,
            type: { type: "1" }
          },
          // 成功回调
          complete: res => {
            wx.hideLoading();
            if (res.result != null) {
              if (newOrderData) { //newOrderData不为空
                orderlist = newOrderData.concat(res.result.data)
                newOrderData = orderlist
              } else {
                newOrderData = res.result.data
              }

              that.setData({
                doneOrderData: newOrderData,
              })
            } else {
              wx.showToast({
                title: '没有更多数据了',
                icon: 'none'
              })
            }
          }
        })

        that.data.donePageIndex += 1
      }

    } else {
      wx.showToast({
        title: '管理员身份认证错误',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../my/my'
        })
      }, 1500)
    }
  },
  showEditItem: function (event) {
    //传递点击项目的订单号
    this.setData({ clickedItemCode: event.target.dataset.code, clickedItemId: event.target.dataset.id })

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
      showEditItemStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)

  },
  //隐藏对话框
  hideEditItem: function () {
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
        showEditItemStatus: false
      })
    }.bind(this), 200)

  },
  deleteItem: function () {
    let that = this
    this.hideEditItem()
    let newInfo = that.data.orderData


    //删除订单列表数组中的数据
    let itemCode = that.data.clickedItemCode
    let itemId = that.data.clickedItemId

    for (var i = 0; i < newInfo.length; i++) {
      if (newInfo[i].code == itemCode) {
        newInfo.splice(i, 1)
      }
    }

    that.setData({ orderData: newInfo })
    //删除数据库中的数据
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'removeOne',
      // 传给云函数的参数
      data: {
        _id: itemId,
      },
      // 成功回调
      complete: res => {
        if (res.result.stats.removed == 1) {
          wx.showToast({
            title: '删除成功',
          })
        }
      }
    })
  },
  openDelConfirm: function () {
    let that = this
    wx.showModal({
      title: '确认',
      content: '是否删除此订单？',
      confirmText: "是",
      cancelText: "否",
      success: function (res) {
        if (res.confirm) {
          that.deleteItem();
        } else {
          return;
        }
      }
    });
  },
  sortByfloor: function (array) {
    let list0 = []; let list1 = []; let list2 = []; let list3 = []; let list4 = []
    for (let i = 0; i < array.length; i++) {
      switch (array[i].unified[0]) {
        case 0:
          list0.push(array[i])
          break;
        case 1:
          list1.push(array[i])
          break;
        case 2:
          list2.push(array[i])
          break;
        case 3:
          list3.push(array[i])
          break;
        default:
          list4.push(array[i])
      }
    }

    let roomList0 = []; let roomList1 = []; let roomList2 = []; let roomList3 = []; let roomList4 = []; let roomList5 = []

    for (let i = 0; i < list0.length; i++) {
      switch (list0[i].unified[1]) {
        //  底下2楼
        case 0:
          roomList0.push(list0[i])
          break;
        case 1:
          roomList1.push(list0[i])
          break;
        case 2:
          roomList2.push(list0[i])
          break;
        case 3:
          roomList3.push(list0[i])
          break;
        case 4:
          roomList4.push(list0[i])
          break;
        default:
          roomList5.push(list0[i])
          break;
      }
    }

    let sortedlist0 = roomList0.concat(roomList1, roomList2, roomList3, roomList4, roomList5)
    let sortList = sortedlist0.concat(list1, list2, list3, list4)
    return sortList
  },
  sortByType: function (arrayList) {
    if (!arrayList) {
      return 0
    }
    let _doneList = []
    let _undoneList = []
    for (let i = 0; i < arrayList.length; i++) {
      switch (arrayList[i].type) {
        case 0:
          _undoneList.push(arrayList[i])
          break;
        case 1:
          _doneList.push(arrayList[i])
          break;
      }
    }

    this.setData({ doneList: _doneList, undoneList: _undoneList })
  },
  doSortByFloor: function () {
    let sortedList = this.sortByfloor(this.data.undoneOrderData)
    this.setData({ undoneOrderData: sortedList })
  },
  sortByTime: function (array) {
    //sortFlag 0:降序 1:升序
    if (this.data.sortFlag == 0) {
      array.sort(function (a, b) {
        return a.time < b.time ? -1 : 1;
      });
      this.setData({ sortFlag: 1 })
    } else {
      array.sort(function (a, b) {
        return a.time < b.time ? 1 : -1;
      });
      this.setData({ sortFlag: 0 })
    }
    return array
  },
  doSortByTime: function () {
    let arr = this.sortByTime(this.data.undoneOrderData)
    this.setData({ undoneOrderData: arr })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.getData(e.currentTarget.id)
  },
  logoutConfirm: function () {
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
  logout: function () {
    wx.showLoading({
      title: '正在退出..',
    })
    wx.setStorage({
      key: 'isAdmin',
      data: 'false',
    })

    setTimeout(() => {
      wx.hideLoading()
      wx.switchTab({
        url: '../../order/order',
      })
    }, 1500)
  },
  //显示对话框
  showPwdModal: function () {
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
      showPwdModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)

  },
  //隐藏对话框
  hidePwdModal: function () {
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
        showPwdModalStatus: false
      })
    }.bind(this), 200)

  },
  formSubmit(e) {
    let that = this
    let psword = e.detail.value.password;
    if (psword == 'weilelianmeng') {
      wx.setStorage({
        key: 'super',
        data: true
      })
      wx.showToast({
        title: '设置成功！',
      })
      that.setData({ _super: true })
    } else {
      wx.showToast({
        title: '密码错误！',
        icon: 'none'
      })
    }
    this.hidePwdModal()
  },
  clearStorge: function () {
    wx.clearStorage()
    wx.showToast({
      title: '清除缓存完成',
    })
  },
  clearStorageConfirm: function () {
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
  },
  changeLanguage(e) {
    console.log('value changed')
    console.log(e.detail)
    let index = e.detail.value;
    this.setData({
      langIndex: index
    });
    wx.T.setLocaleByIndex(index);
    this.setLanguage();
    event.emit('languageChanged');

    app.globalData.langIndex = this.data.langIndex;
    app.globalData.language = app.globalData.languages[wx.T.langCode[this.data.langIndex]];

    wx.setStorageSync("lanIndex_client", e.detail.value)
  },
})
