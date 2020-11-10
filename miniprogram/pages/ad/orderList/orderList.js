// var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
// var mConfigs = require('../../../utils/config.js')
// const ImgLoader = require('../../../img-loader/img-loader.js')
// var app = getApp()
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     tabs: ["全部订单", "已完成", "未完成"],
//     activeIndex: 0,
//     sliderOffset: 0,
//     sliderLeft: 0,
//     defaultImagePath: '../../../images/pic_160.png',
//     clickedItemCode:'',
//     clickedItemId:'',
//     pageIndex: 0,
//     pageSize: 10,//列表订单个数
//     dbName: 'bills',
//     doneList:[],
//     undoneList:[],
//     sortFlag: 0
//   },
//   tabClick: function (e) {
//     this.setData({
//       sliderOffset: e.currentTarget.offsetLeft,
//       activeIndex: e.currentTarget.id
//     });
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
  
//   onLoad: function (options) {
//    this.getData()
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

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
//     this.getData()
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
//   getData: function (s) {
//     console.log('index is' + this.data.pageIndex)
//     var that = this;
//     wx.showLoading({
//       title: '加载中...',
//     });

//     let userId = app.globalData.openid
//     let isadmin = ''
//     try {
//       var value = wx.getStorageSync('isAdmin')
//       if (value) {
//         // Do something with return value
//         isadmin = value
//       }
//     } catch (e) {
//       // Do something when catch error
//       wx.showToast({
//         title: '读取内存数据错误',
//       })
//     }

//     let dbName = that.data.dbName
//     let pageIndex = that.data.pageIndex
//     let pageSize = that.data.pageSize
//     let newOrderData = that.data.orderData
//     let orderlist = []
//     if (isadmin) {
//       if (s) {
//         wx.cloud.callFunction({
//           // 需调用的云函数名
//           name: 'getOrderInfo',
//           // 传给云函数的参数
//           data: {
//             dbName,
//             pageIndex,
//             pageSize,
//             buyers: [{}],
//             type: { type: "1" }
//           },
//           // 成功回调
//           complete: res => {
//             console.log('done order data is =》');
//             console.log(res);
//             wx.hideLoading();
//             if (res.result != null) {
//               if (newOrderData) { //newOrderData不为空
//                 orderlist = newOrderData.concat(res.result.data)
//                 newOrderData = orderlist
//               } else {
//                 newOrderData = res.result.data
//               }

//               that.setData({
//                 orderData: newOrderData,
//               })
//             } else {
//               wx.showToast({
//                 title: '没有更多数据了',
//               })
//             }
//           }
//         })

//         that.data.pageIndex += 1
//       } else {
//         wx.cloud.callFunction({
//           // 需调用的云函数名
//           name: 'getOrderInfo',
//           // 传给云函数的参数
//           data: {
//             dbName,
//             pageIndex,
//             pageSize,
//             buyers: app.globalData.adminInfo.buyers,
//             type: { type: "1" }
//           },
//           // 成功回调
//           complete: res => {
//             console.log('admin get order data is =》');
//             console.log(res);
//             wx.hideLoading();
//             if (res.result != null) {
//               if (newOrderData) { //newOrderData不为空
//                 orderlist = newOrderData.concat(res.result.data)
//                 newOrderData = orderlist
//               } else {
//                 newOrderData = res.result.data
//               }

//               that.setData({
//                 orderData: newOrderData,
//               })
//             } else {
//               wx.showToast({
//                 title: '没有更多数据了',
//               })
//             }
//           }
//         })

//         that.data.pageIndex += 1
//       }

//     } else {
//       wx.showToast({
//         title: '管理员身份认证错误',
//       })
//       setTimeout(() => {
//         wx.switchTab({
//           url: '../my/my'
//         })
//       }, 1500)
//     }
//   },
//   showEditItem: function (event) {
//     //传递点击项目的订单号
//     this.setData({ clickedItemCode: event.target.dataset.code, clickedItemId: event.target.dataset.id})

//     // 显示遮罩层
//     var animation = wx.createAnimation({
//       duration: 200,
//       timingFunction: "linear",
//       delay: 0
//     })
//     this.animation = animation
//     animation.translateY(300).step()
//     this.setData({
//       animationData: animation.export(),
//       showEditItemStatus: true
//     })
//     setTimeout(function () {
//       animation.translateY(0).step()
//       this.setData({
//         animationData: animation.export()
//       })
//     }.bind(this), 200)

//   },
//   //隐藏对话框
//   hideEditItem: function () {
//     // 隐藏遮罩层
//     var animation = wx.createAnimation({
//       duration: 200,
//       timingFunction: "linear",
//       delay: 0
//     })
//     this.animation = animation
//     animation.translateY(300).step()
//     this.setData({
//       animationData: animation.export(),
//     })
//     setTimeout(function () {
//       animation.translateY(0).step()
//       this.setData({
//         animationData: animation.export(),
//         showEditItemStatus: false
//       })
//     }.bind(this), 200)

//   },
//   deleteItem:function(){
//     let that = this
//     this.hideEditItem()
//     let newInfo = that.data.orderData


//     //删除订单列表数组中的数据
//     let itemCode = that.data.clickedItemCode
//     let itemId = that.data.clickedItemId

//     for(var i = 0;i<newInfo.length;i++){
//       if (newInfo[i].code == itemCode){
//         newInfo.splice(i, 1)
//       }
//     }

//     that.setData({orderData:newInfo})
//     //删除数据库中的数据
//       wx.cloud.callFunction({
//         // 需调用的云函数名
//         name: 'removeOne',
//         // 传给云函数的参数
//         data: {
//           _id: itemId,
//         },
//         // 成功回调
//         complete: res => {
//           console.log('removeOne res =》');
//           console.log(res);
//           if (res.result.stats.removed == 1) {
//             wx.showToast({
//               title: '删除成功',
//             })
//           }
//         }
//       })
//   },
//   openDelConfirm:function(){
//     let that = this
//     wx.showModal({
//       title: '确认',
//       content: '是否删除此订单？',
//       confirmText: "是",
//       cancelText: "否",
//       success: function (res) {
//         console.log(res);
//         if (res.confirm) {
//           that.deleteItem();
//         } else {
//           return;
//         }
//       }
//     });
//   },
//   sortByfloor:function(array){
//     let list0 = []; let list1 = []; let list2 = []; let list3 = []; let list4 = []
//     for (let i = 0; i < array.length; i++) {
//       switch (array[i].unified[0]) {
//         case 0:
//           list0.push(array[i])
//           break;
//         case 1:
//           list1.push(array[i])
//           break;
//         case 2:
//           list2.push(array[i])
//           break;
//         case 3:
//           list3.push(array[i])
//           break;
//         default:
//           list4.push(array[i])
//       }
//     }

//     let roomList0 = []; let roomList1 = []; let roomList2 = []; let roomList3 = []; let roomList4 = []; let roomList5 = []

//     for (let i = 0; i < list0.length; i++) {
//       switch (list0[i].unified[1]) {
//         //  底下2楼
//         case 0:
//           roomList0.push(list0[i])
//           break;
//         case 1:
//           roomList1.push(list0[i])
//           break;
//         case 2:
//           roomList2.push(list0[i])
//           break;
//         case 3:
//           roomList3.push(list0[i])
//           break;
//         case 4:
//           roomList4.push(list0[i])
//           break;
//         default:
//           roomList5.push(list0[i])
//           break;
//       }
//     }

//     let sortedlist0 = roomList0.concat(roomList1, roomList2, roomList3, roomList4, roomList5)
//     let sortList = sortedlist0.concat(list1, list2, list3, list4)
//     return sortList
//   },
//   sortByType:function(arrayList){
//     if(!arrayList){
//       return 0
//     }
//     let _doneList = []
//     let _undoneList = []
//     for (let i = 0; i <arrayList.length;i++){
//       switch (arrayList[i].type){
//         case 0:
//           _undoneList.push(arrayList[i])
//         break;
//         case 1:
//           _doneList.push(arrayList[i])
//         break;
//       }
//     }

//     this.setData({ doneList: _doneList, undoneList: _undoneList})
//     console.log('done list')
//     console.log(this.data.doneList)
//     console.log('undone list')
//     console.log(this.data.undoneList)
//   },
//   doSort:function(){
//     let sortedList = this.sortByfloor(this.data.undoneList)
//     this.setData({undoneList:sortedList})
//   },
//   sortByTime:function(array){
//     //sortFlag 0:降序 1:升序
//     if(this.data.sortFlag == 0){
//     array.sort(function (a, b) {
//       return a.time < b.time ? -1 : 1;
//     });
//       this.setData({sortFlag:1})
//   }else{
//       array.sort(function (a, b) {
//         return a.time < b.time ? 1 : -1;
//       });
//       this.setData({sortFlag:0})
//   }
//   return array
//   },
//   doSortByTime:function(){
//     let arr = this.sortByTime(this.data.undoneList)
//     this.setData({ undoneList: arr})
//   },
//   initSet:function(){
//     this.data.pageIndex = 0
//     this.data.orderData = []
//     this.data.doneList = []
//     this.data.undoneList = []
//   }
// })

Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    orderData: Array
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
   
  }
})