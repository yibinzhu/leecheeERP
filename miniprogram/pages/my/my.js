//获取应用实例
const app = getApp()
const event = require('../../utils/event');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phoneNum:'',
    deliverAddress:'',
    islogin:false,
    dbName:'user',
    userInfo:'',
    openId:'',
    logined:'',
    logged:false,
    language: '',
    languages: ['简体中文', '한국어'],
    langIndex: 0,

  },

  onLoad: function () {
    this.setData({
      langIndex: app.globalData.langIndex
    });

    this.setLanguage();

    this.data.logined = app.globalData.logined
    this.init()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // getUserInfo: function (e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  saveDeliverAddress:function(e){
    let value = e.detail.value;
    console.log('address is ' + value)
    this.setData({
      deliverAddress:value,
    })
    app.globalData.deliverAddress = value;
  },
  savePhoneNum: function (e) {
    let value = e.detail.value;
    console.log('phone num is '+value)
    this.setData({
      phoneNum: value,
    })
    app.globalData.phoneNum = value;
  },

  alertSave:function(event){
    console.log(event);
    var that = this;
    let flag = event.currentTarget.dataset.flag
    console.log('flag is=》'+flag);
    switch(flag){
      case '0':
        if(that.data.phoneNum == ''){
          wx.showToast({
            title: '请填写电话',
          })
        }else{
          wx.showToast({
            title: '保存成功',
          })
        }
        break;
      case '1':
        if (that.data.deliverAddress == '') {
          wx.showToast({
            title: '请填写地址',
          })
        } else {
          wx.showToast({
            title: '保存成功',
          })
        }
        break;
    }
   
  },
  login:function(e){
    var that =  this

    if(that.data.islogin){
      that.logout()
      return
    }else{
    wx.showLoading({
      title: '登陆中...',
    })
    
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
              that.data.userInfo = res.userInfo
            }
          })
        }
      }
    })

    
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'login',
      // 传给云函数的参数
      data: {
      
      },
      // 成功回调
      complete: res => {

        wx.hideLoading()

        console.log('openid is'+res.result.openid)
        console.log('login res ')
        console.log(res.result)

        that.data.openId = res.result.openid
        wx.setStorage({
          key: 'openid',
          data: res.result.openid,
        });
        app.globalData.openid = res.result.openid;
        app.globalData.logined = true
        
        that.getStatasInfo()

        if (app.globalData.openid != null) {
          wx.showToast({
            title: '登陆成功',
          })

          let user = {}
          user.nickName = that.data.userInfo.nickName
          user.gender = that.data.userInfo.gender
          user.avatarUrl = that.data.userInfo.avatarUrl
          user._openid = res.result.openid
          //向数据库添加用户数据
          that.update(user)

          that.setData({
            islogin: true
          })

        }
        
      }
    })
    }
  },

  init:function(){
    this.setData({
      islogin: app.globalData.logined
    })
  },
  logout:function(){
    this.setData({
      islogin: false,
      allNum:'',
      doneNum:'',
      undoneNum:''
    })
    wx.showToast({
      title: '退出成功',
    })
    // wx.setStorage({
    //   key: "openid",
    //   data: ""
    // })

    app.globalData.logined = false
    
    setTimeout(()=>{
      wx.navigateTo({
        url: '../login/login',
      })
    },1000)
  
  },
  onGetUserInfo: function (e) {
    var that = this

    console.log('onGetUserInfo=>')
    console.log(e.detail.userInfo)
      if (!that.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
    that.login()

  },
update:function(data){
  var that = this
  const db = wx.cloud.database()
  db.collection(this.data.dbName).where({
    _openid: data._openid,
  })
    .get({
      success: function(res){
        console.log(res)
        if(res.data.length < 1){
          that.addUser(data)
        }
      },
      fail: console.error
    })


},
addUser:function(userInfo){
  console.log(userInfo)
  var that = this
  wx.cloud.callFunction({
    // 需调用的云函数名
    name: 'addUser',
    // 传给云函数的参数
    data: {
      dbName: that.data.dbName,
      data: userInfo
    },
    // 成功回调
    complete: res => {
      console.log('添加用户')
      console.log(res)
    }
  })
},
  getUserInfo: function () {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
  clearStorge: function () {
    wx.clearStorage()
    wx.showToast({
      title: '清除缓存完成',
    })
  },
  getStatasInfo: function (s) {
    let _buyers = []
    let _openid  = {}
    _openid._openid = app.globalData.openid
    _buyers.push(_openid)
    var that = this
      wx.cloud.callFunction({
        // 需调用的云函数名
        name: 'getStatasInfo',
        // 传给云函数的参数
        data: {
          dbName: 'bills',
          buyers: _buyers,
        },
        // 成功回调
        complete: res => {
          console.log(res)
          try {
            that.setData({
              allNum: res.result.all.total,
              doneNum: res.result.done.total,
              undoneNum: res.result.undone.total,
              todayNum: res.result.today.total
            })
          } catch (e) {
            console.log(e)
          }
        }
      })
  },
  goMyInfo:function(){
    if (!app.globalData.logined) {
      wx.showToast({
        title: '请先登陆',
      })
      return 
      }else{
        wx.navigateTo({
          url: '../myInfo/myInfo',
        })
      }
  },
  handleContact(e) {
    console.log(e.path)
    console.log(e.query)
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
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    wx.T.setTabBarLang(this.data.langIndex);
    wx.T.setNavigationBarTitle();
  },
})
