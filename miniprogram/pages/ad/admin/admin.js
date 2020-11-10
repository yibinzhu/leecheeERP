// // pages/ad/admin/admin.js
var app = getApp()
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//   adminInfo:[],
//   pageIndex:0,
//   pageSize:10,
//   dbName:'bills',
//   allNum:0,
//   doneNum:0,
//   undoneNum:0,
//   todayNum:0,
//   _super: false
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     // var that = this
//     // wx.getStorage({
//     //   key: 'super',
//     //   success: function (res) {
//     //     that.setData({ _super: res.data })

//     //     that.getStatasInfo(that.data._super)

//     //   },
//     //   fail: function (res) { },
//     //   complete: function (res) { },
//     // })

//     // that.getAdminInfo()
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
//     var that = this
//     wx.getStorage({
//       key: 'super',
//       success: function (res) {
//         that.setData({ _super: res.data })

//         that.getStatasInfo(that.data._super)

//       },
//       fail: function (res) { },
//       complete: function (res) { },
//     })

//     that.getAdminInfo()
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   },
//   getData:function(){
//     wx.showLoading({
//       title: '加载中...',
//     })
//     let dbName= this.data.dbName
//     let pageIndex= this.data.pageIndex
//     let pageSize = this.data.pageSize

//     wx.cloud.callFunction({
//       // 需调用的云函数名
//       name: 'pagination',
//       // 传给云函数的参数
//       data: {
//         dbName,
//         pageIndex,
//         pageSize
//       },
//       // 成功回调
//       complete: res => {
//         wx.hideLoading()
//         console.log('res getdata =》');
//         console.log(res);
//         if (res.result.data.length<1){
//           wx.showToast({
//             title: '没有更多数据了',
//           })
//         }
        
//       }
//     })
    
//     this.data.pageIndex += 10
//     },
//   getStatasInfo: function (s) {
//     var that = this
//     if (s){
//       wx.cloud.callFunction({
//         // 需调用的云函数名
//         name: 'getStatasInfo',
//         // 传给云函数的参数
//         data: {
//           dbName: 'bills',
//           buyers: [{}],
//         },
//         // 成功回调
//         complete: res => {
//           that.setData({
//             allNum: res.result.all.total,
//             doneNum: res.result.done.total,
//             undoneNum: res.result.undone.total,
//             todayNum: res.result.today.total
//           })
//         }
//       })
//     }else{
//     wx.cloud.callFunction({
//       // 需调用的云函数名
//       name: 'getStatasInfo',
//       // 传给云函数的参数
//       data: {
//         dbName: 'bills',
//         buyers: that.data.adminInfo.buyers,
//       },
//       // 成功回调
//       complete: res => {
//         try{
//         that.setData({
//           allNum: res.result.all.total,
//           doneNum: res.result.done.total,
//           undoneNum: res.result.undone.total,
//           todayNum: res.result.today.total
//         })
//         }catch(e){
//           console.log(e)
//         }
//       }
//     })
//     }

//   },
//   getAdminInfo:function(){
//     var that = this
//     const db = wx.cloud.database()
//     db.collection('adminlist').where({
//       _openid: app.globalData.openid,
//     })
//       .get({
//         success:function(res){
//           console.log('admin info res=>')
//           console.log(res.data[0])
//           if (res.data[0]){
//             that.setData({adminInfo:res.data[0]})
//             // 存储管理员信息到全局变量中
//             app.globalData.adminInfo = res.data[0]
//           }

//         },
//         fail: console.error
//       })
//   }
// })

Component({
  data:{
  adminInfo:[],
  pageIndex:0,
  pageSize:10,
  dbName:'bills',
  allNum:0,
  doneNum:0,
  undoneNum:0,
  todayNum:0,
  _super: false
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log('show page')
    var that = this
    wx.getStorage({
      key: 'super',
      success: function (res) {
        that.setData({ _super: res.data })

        that.getStatasInfo(that.data._super)

      },
      fail: function (res) { },
      complete: function (res) { },
    })

      that.getAdminInfo()
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  methods: {
    onTap: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },
  getData:function(){
    wx.showLoading({
      title: '加载中...',
    })
    let dbName= this.data.dbName
    let pageIndex= this.data.pageIndex
    let pageSize = this.data.pageSize

    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'pagination',
      // 传给云函数的参数
      data: {
        dbName,
        pageIndex,
        pageSize
      },
      // 成功回调
      complete: res => {
        wx.hideLoading()
        console.log('res getdata =》');
        console.log(res);
        if (res.result.data.length<1){
          wx.showToast({
            title: '没有更多数据了',
          })
        }

      }
    })

    this.data.pageIndex += 10
    },
  getStatasInfo: function (s) {
    var that = this
    if (s){
      wx.cloud.callFunction({
        // 需调用的云函数名
        name: 'getStatasInfo',
        // 传给云函数的参数
        data: {
          dbName: 'bills',
          buyers: [{}],
        },
        // 成功回调
        complete: res => {
          that.setData({
            allNum: res.result.all.total,
            doneNum: res.result.done.total,
            undoneNum: res.result.undone.total,
            todayNum: res.result.today.total
          })
        }
      })
    }else{
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getStatasInfo',
      // 传给云函数的参数
      data: {
        dbName: 'bills',
        buyers: that.data.adminInfo.buyers,
      },
      // 成功回调
      complete: res => {
        try{
        that.setData({
          allNum: res.result.all.total,
          doneNum: res.result.done.total,
          undoneNum: res.result.undone.total,
          todayNum: res.result.today.total
        })
        }catch(e){
          console.log(e)
        }
      }
    })
    }

  },
  getAdminInfo:function(){
    var that = this
    const db = wx.cloud.database()
    db.collection('adminlist').where({
      _openid: app.globalData.openid,
    })
      .get({
        success:function(res){
          console.log('admin info res=>')
          console.log(res.data[0])
          if (res.data[0]){
            that.setData({adminInfo:res.data[0]})
            // 存储管理员信息到全局变量中
            app.globalData.adminInfo = res.data[0]
          }

        },
        fail: console.error
      })
  }
  }
})