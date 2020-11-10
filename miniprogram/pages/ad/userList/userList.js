// pages/ad/userList/userList.js
import event from '../../../utils/event';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex:0,
    pageSize:10,
    dbName:'user',
    pageIndex_admin: 0,
    pageSize_admin: 10,
    dbName_admin: 'adminlist',
    userData:[],
    adminList: [],
    pickerId:'',
    checkboxClicked:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);

    this.getData()
    //获取管理员信息
    this.getAdminList()
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
  getData:function(){
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'pagination',
      // 传给云函数的参数
      data: {
        dbName:that.data.dbName,
        pageIndex:that.data.pageIndex,
        pageSize:that.data.pageSize
      },
      // 成功回调
      complete: res => {
        console.log('admin user data is =》');
        console.log(res);
        wx.hideLoading();
        if (res.result != null) {

          let _data = that.data.userData
          if (_data) { //newOrderData不为空
            _data = _data.concat(res.result.data)
          } else {
            _data = res.result.data
          }
          that.setData({
            userData: _data,
          })
        } else {
          wx.showToast({
            title: '没有更多数据了',
            icon: 'none'
          })
        }
    that.data.pageIndex += 1
  }})},
  checkboxChange: function (e) {
    this.data.checkboxClicked = true
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var userData = this.data.userData, values = e.detail.value;
    for (var i = 0, lenI = userData.length; i < lenI; ++i) {
      userData[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (userData[i]._openid == values[j]) {
          userData[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      userData: userData
    });
  },
  showAdminList: function () {
    if (this.data.checkboxClicked!=true){
      wx.showToast({
        title: '请选择用户',
        icon:'none'
      })
    }else{
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
      showAdminListStatus: true,
      showMenuStatus:false

    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    }
  },
  //隐藏对话框
  hideAdminList: function () {
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
        showAdminListStatus: false
      })
    }.bind(this), 200)

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.data.pickerCheckClicked = true
    this.data.pickerId = e.detail.value
    var adminList = this.data.adminList;
    for (var i = 0, len = adminList.length; i < len; ++i) {
      adminList[i].checked = adminList[i]._id == e.detail.value;
    }

    this.setData({
      adminList: adminList
    });
  },
  getAdminList:function(){
    let that = this
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'pagination',
      // 传给云函数的参数
      data: {
        dbName: that.data.dbName_admin,
        pageIndex: that.data.pageIndex_admin,
        pageSize: that.data.pageSize_admin
      },
      // 成功回调
      complete: res => {
        console.log('admin get admin list data is =》');
        console.log(res);
        if (res.result != null) {

          let _data = that.data.adminList
          if (_data) { //newOrderData不为空
            _data = _data.concat(res.result.data)
          } else {
            _data = res.result.data
          }
          that.setData({
            adminList: _data,
          })
        } else {
          wx.showToast({
            title: '没有更多数据了',
            icon:'none'
          })
        }
        that.data.pageIndex_admin += 1
      }
    })
  },
  setPicker:function(){
    wx.showLoading({
      title: '设置中...',
    })
    let that = this
    let userList = []
    let pickerId = that.data.pickerId
    let data = that.data.userData
    for(let i = 0;i<data.length;i++){
      if(data[i].checked == true){
        let ob = {}
        ob._openid = data[i]._openid
        userList.push(ob)
      }
    }
    let _id = that.data.pickerId
    console.log('id is'+_id)
    console.log(userList)
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'updateOne',
      // 传给云函数的参数
      data: {
        _id: _id,
        dbName:'adminlist',
        data: { buyers: userList}
      },
      // 成功回调
      complete: res => {
        wx.hideLoading();
        console.log('update res =》');
        console.log(res);

        if (res.result.stats.updated == 1) {
          wx.showToast({
            title: '设置成功',
          })
        } else {
          wx.showToast({
            title: '设置失败',
            icon: 'none'
          })

        }

        that.resetCheckList()
      }
      })
  },
  showAdminConfirm:function(){
    let that = this
    if (this.data.checkboxClicked == false) {
      wx.showToast({
        title: '请选择用户',
        icon: 'none'
      })
    } else {
    wx.showModal({
      title: '提示',
      content: '确定设置此用户为管理员吗？',
      success: function (sm) {
        if (sm.confirm) {
          that.setAdmin()
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })}
  },
  setAdmin:function(){
    const db = wx.cloud.database()
    let that = this
    let data = that.data.userData
    let _admin = {}
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked == true) {
        _admin.avatarUrl = data[i].avatarUrl
        _admin.gender = data[i].gender
        _admin.nickName = data[i].nickName
        _admin._openid = data[i]._openid

        db.collection(that.data.dbName_admin).where({
          _openid: _admin._openid,
        })
          .get({
            success: function(res){
              if (res.data.length>0){
                console.log('此用户身份已为管理员')
                return null
              }else{
                that.update(_admin)
              }
              console.log('添加成管理员成功->'+i)
            },
            fail: console.error
          })


      }
    }
    console.log('_admin =>')
    console.log(_admin)
    wx.showToast({
      title: '添加成功',
    })
    //初始化checklist
    that.resetCheckList()
  },
  showPickerConfirm: function () {
    let that = this
    if (this.data.pickerCheckClicked == false) {
      wx.showToast({
        title: '请选择取货人',
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定设置此用户为取货人吗？',
        success: function (sm) {
          if (sm.confirm) {
            that.setPicker()
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  update:function(_data){
    let that = this
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'col-add',
      // 传给云函数的参数
      data: {
        data:_data,
        dbName: that.data.dbName_admin
      },
      // 成功回调
      complete: res => {
       console.log('添加成功')
      }
    })

    that.resetCheckList()
  },
  getMoreAdmin:function(){
    this.getAdminList()
  },
  resetCheckList:function(){
    var that = this
    let data = that.data.userData
    for (let i = 0; i < data.length; i++) {
        data[i].checked = false
      }
    that.setData({userData:data})
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
  showDelConfirm:function(){
    let that = this
    if (this.data.pickerCheckClicked == false) {
      wx.showToast({
        title: '请选择用户',
        icon: 'none'
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
  delUsers:function(){
    let that = this
    if (this.data.pickerCheckClicked == false) {
      wx.showToast({
        title: '请选择用户',
        icon: 'none'
      })
    } else {
    let data = that.data.userData
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked == true){
        //删除订单列表数组中的数据
        let _user = data[i]
        // 注意删除顺序 先删除数据库中的数据 再删除数组中的数据
        that.doDel(data[i]._id)
        data.splice(i, 1)
      }
    }
    that.setData({
      userData:data
    })

    that.hideMenu()

    wx.showToast({
      title: '删除成功',
    })
  }
  },
  doDel: function (itemId){
    let that = this
    //删除数据库中的数据
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'removeOne',
      // 传给云函数的参数
      data: {
        dbName: 'user',
        _id: itemId,
      },
      // 成功回调
      complete: res => {
        console.log('removeOne res =》');
        console.log(res);
        if (res.result.stats.removed == 1) {
          console.log("删除成功")
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