import event from '../../utils/event';
var app = getApp()
var db = null
var sliderWidth = 96;
Page({
  data: {
    tabs: ["全部", "未完成", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    dbName: 'bills',
    pageSize: 10,
    pageIndex: 0,
    orderData: [],
    allOrderData: [],
    doneOrderData: [],
    undoneOrderData: [],
    allPageIndex: 0,
    donePageIndex: 0,
    undonePageIndex: 0,
    nav_url: '/pages/billDetail/billDetail',
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
    if (idx == 0) {
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

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    that.getData()
  },
  getData: function () {
    let that = this;
    let activeIndex = this.data.activeIndex
    let userId = app.globalData.openid
    if (activeIndex == 0) {
      that.getAll(userId)
    }
    if (activeIndex == 1) {
      that.getUndone(userId)
    }
    if (activeIndex == 2) {
      that.getDone(userId)
    }
  },
  getAll: function (userId) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });

    if (db == null) {
      db = wx.cloud.database()
    }
    var that = this;
    if(userId){
      if(that.data.totalItem == null){
      db.collection(that.data.dbName).where({
        _openid: userId // 填入当前用户 openid
      }).count().then(res => {
        console.log(res.total)

        let _batchTimes = Math.ceil(res.total / that.data.pageSize)
        that.setData({ totalItem: res.total,batchTimes:_batchTimes})

        if(that.data.pageIndex<that.data.batchTimes){
          
          that.connectDB_all(db, userId)

        }else{
          wx.showToast({
            title: '没有更多数据了',
          })
        }

      })
      }else{
        if (that.data.batchTimes>that.data.pageIndex){
          that.connectDB_all(db, userId)
        }else{
          wx.showToast({
            title: '没有更多数据了',
          })
        }
      }

    }else{
      wx.showToast({
        title: '请先登录',
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../my/my'
        })
      },1500)

    }

  },
  getUndone: function (userId) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    if (db == null) {
      db = wx.cloud.database()
    }
    if (userId) {
      const _ = db.command
      if (that.data.totalItem == null) {
        db.collection(that.data.dbName).where({
          _openid: _.and({ type: "0" })
        }).count().then(res => {
          console.log(res.total)
          let _batchTimes = Math.ceil(res.total / that.data.pageSize)
          that.setData({ totalItem: res.total, batchTimes: _batchTimes })

          if (that.data.pageIndex < that.data.batchTimes) {
            
            db.collection(that.data.dbName).where({
              _openid: _.and({ type: "0" })
            }).limit(that.data.pageSize).skip(that.data.undonePageIndex * that.data.pageSize).orderBy('time', 'desc').get({
              success: function (res) {
                console.log('order data is ');
                wx.hideLoading();
                console.log(res.data)
                let nowData = that.data.undoneOrderData
                that.setData({
                  undoneOrderData: nowData.concat(res.data)
                })
              }
            })
            that.data.undonePageIndex += 1

          } else {
            wx.showToast({
              title: '没有更多数据了',
            })
          }

        })
      } else {
        if (that.data.batchTimes > that.data.pageIndex) {
          db.collection(that.data.dbName).where({
            _openid: _.and({ type: "0" })
          }).limit(that.data.pageSize).skip(that.data.undonePageIndex * that.data.pageSize).orderBy('time', 'desc').get({
            success: function (res) {
              console.log('order data is ');
              wx.hideLoading();
              console.log(res.data)
              let nowData = that.data.undoneOrderData
              that.setData({
                undoneOrderData: nowData.concat(res.data)
              })
            }
          })
          that.data.undonePageIndex += 1

        } else {
          wx.showToast({
            title: '没有更多数据了',
          })
        }
      }

    } else {
      wx.showToast({
        title: '请先登录',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../my/my'
        })
      }, 1500)

    }
   
  },
  getDone: function (userId) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    });
    if (db == null) {
      db = wx.cloud.database()
    }
    if (userId) {
      const _ = db.command
      if (that.data.totalItem == null) {
        db.collection(that.data.dbName).where({
          _openid: _.and({ type: "1" })
        }).count().then(res => {
          console.log(res.total)
          let _batchTimes = Math.ceil(res.total / that.data.pageSize)
          that.setData({ totalItem: res.total, batchTimes: _batchTimes })

          if (that.data.pageIndex < that.data.batchTimes) {

            db.collection(that.data.dbName).where({
              _openid: _.and({ type: "1" })
            }).limit(that.data.pageSize).skip(that.data.donePageIndex * that.data.pageSize).orderBy('time', 'desc').get({
              success: function (res) {
                console.log('order data is ');
                wx.hideLoading();
                console.log(res.data)
                let nowData = that.data.doneOrderData
                that.setData({
                  doneOrderData: nowData.concat(res.data)
                })
              }
            })
            that.data.donePageIndex += 1

          } else {
            wx.showToast({
              title: '没有更多数据了',
            })
          }

        })
      } else {
        if (that.data.batchTimes > that.data.pageIndex) {
          db.collection(that.data.dbName).where({
            _openid: _.and({ type: "1" })
          }).limit(that.data.pageSize).skip(that.data.donePageIndex * that.data.pageSize).orderBy('time', 'desc').get({
            success: function (res) {
              console.log('order data is ');
              wx.hideLoading();
              console.log(res.data)
              let nowData = that.data.doneOrderData
              that.setData({
                doneOrderData: nowData.concat(res.data)
              })
            }
          })
          that.data.donePageIndex += 1

        } else {
          wx.showToast({
            title: '没有更多数据了',
          })
        }
      }

    } else {
      wx.showToast({
        title: '请先登录',
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../my/my'
        })
      }, 1500)

    }

   
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.getData(e.currentTarget.id)
  },
  connectDB_all: function (db, userId){
    var that = this
    db.collection(that.data.dbName).where({
      _openid: userId
    }).limit(that.data.pageSize).skip(that.data.allPageIndex * that.data.pageSize).orderBy('time', 'desc').get({
      success: function (res) {
        console.log('order data is ');
        wx.hideLoading();
        console.log(res.data)
          let nowData = that.data.allOrderData
          that.setData({
            allOrderData: nowData.concat(res.data)
          })
      }
    })
  that.data.allPageIndex += 1
  },
  showEditItem: function (event) {
    console.log('Comment showed')
    console.log(event.target.dataset.id)
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
    let newInfo = []

    let activeIndex = this.data.activeIndex
    if (activeIndex == 0) {
      newInfo = that.data.allOrderData
    }
    if (activeIndex == 1) {
      newInfo = that.data.undoneOrderData
    }
    if (activeIndex == 2) {
      newInfo = that.data.doneOrderData
    }


    //删除订单列表数组中的数据
    let itemCode = that.data.clickedItemCode
    let itemId = that.data.clickedItemId

    console.log('click id=>' + itemId)

    for (var i = 0; i < newInfo.length; i++) {
      if (newInfo[i].code == itemCode) {
        newInfo.splice(i, 1)
      }
    }

    if (activeIndex == 0) {
      that.setData({ allOrderData: newInfo })
    }
    if (activeIndex == 1) {

      that.setData({ undoneOrderData: newInfo })
    }
    if (activeIndex == 2) {

      that.setData({ doneOrderData: newInfo })
    }

    //删除数据库中的数据
    const db = wx.cloud.database()
    db.collection(that.data.dbName).doc(itemId).remove({
      success: function(res){
        console.log(res);
        if (res.result.stats.removed == 1) {
          wx.showToast({
            title: '删除成功',
          })
        }
      },
      fail: console.error
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
        console.log(res);
        if (res.confirm) {
          that.deleteItem();
        } else {
          return;
        }
      }
    });
  },
  setLanguage() {
    let that = this
    this.setData({
      language: wx.T.getLanguage()
    })
  }
})
