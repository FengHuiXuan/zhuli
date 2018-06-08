//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    let that = this
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
 
  //that.globalData.logins()

 
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    that.globalData.logins(res => {
   
    })
  },
  
  globalData: {
    userInfo: null,
    apis: 'https://services.17link.cc/',
    //apis: 'https://test020.17link.cc/',
    httprequest(RM,obj){
      wx.request({
        url: this.apis+RM,
        method:'GET',
        ...obj
      })
    },
    pup(texts) {
      wx.showModal({
        title: '提示',
        content: texts,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    },
    logins(func){
      let that = this
      wx.login({ //登陆
        success: resCode => {
          wx.getSetting({ 
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({ 
                  success: res => {
                    wx.setStorageSync('userInfo', res.userInfo)
                    
                    that.httprequest('post/login',{  //获取
                      data:{
                        'code': resCode.code,
                        'rawData': res.rawData
                      },
                      success:function(res){
                        if (res.data.status == 1){
                          wx.setStorageSync('3rd_session', res.data.data)
                          wx.setStorageSync('phone_state', res.data.phone_state)
                          func && func(res)
                        }
                      }
                    })
                  }
                })
              }
            }
          })
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })
    },
    checkSession(succfun,f){
      let that = this
      wx.checkSession({
        success: succfun,
        fail: function (res) {
          console.log('登陆失败', res)
          if(f){

          }else{
            wx.showToast({
              title: '登陆过期重新操作',
              icon: 'none',
              duration: 2000
            })
          }
          that.logins()
        }
      })
    }
  }
})