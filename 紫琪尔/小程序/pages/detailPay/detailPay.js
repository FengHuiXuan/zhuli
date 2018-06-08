// pages/detailPay/detailPay.js
function isPoneAvailable(str) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
} 

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   phone:"",
   verify:'',
   popUpstate:false,
   detailPaymes:'',
   phone_state:'',
   againstSetTime:{
     name_:'获取验证码',
     state:false
   }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this    
    console.log(app.globalData.detailPay)
    that.setData({
      detailPaymes: app.globalData.detailPay
    })
  
    if (wx.getStorageSync('phone_state') == 0){
      that.setData({
        popUpstate:true
      })
    } else {
      that.setData({
        popUpstate: false,
        phone_state: wx.getStorageSync('phone_state')
      })
    }
  }, 
  acquire(){ //获取验证吗
    let phone = this.data.phone
    let that = this
    if (!isPoneAvailable(phone)){
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码'
      })
      return 
    }
 
    app.globalData.httprequest('sendSmsCode',{
      data:{
        session3rd: wx.getStorageSync('3rd_session'),
        phone: phone
      },
      success: res => {
        console.log(121212,res)
        if (res.data.state == 1) {
          that.againsttime()
        }
        console.log(res)
      }
    })

  },
  submitPay(){ //提交
    let phone = this.data.phone
    let verify = this.data.verify
    console.log(phone, verify)
    if (!isPoneAvailable(phone)){
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码'
      })
      return 
    } else if (verify == ''){
      wx.showModal({
        title: '提示',
        content: '请输入验证码'
      })
      return 
    }
    let that = this
    app.globalData.httprequest('verifySmsCode', {
      data: {
        session3rd: wx.getStorageSync('3rd_session'),
        phone: phone,
        code: verify
      },
      success: res => {
        console.log(res)
        if (res.data.state == 1){
          wx.setStorageSync('phone_state', phone)
          that.setData({
            popUpstate: false,
            phone_state: wx.getStorageSync('phone_state')
          })
        } else if (res.data.state == 0){
          wx.showModal({
            title: '提示',
            content: res.data.message
          })
        }
      }
    })
  },
  submitorder(){//提交订单
    let that = this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    if (wx.getStorageSync('phone_state') == 0) {
      that.setData({
        popUpstate: true
      })
      return
    }
    app.globalData.httprequest('subServicesOrder',{
      data:{
        session3rd: wx.getStorageSync('3rd_session'),
        services_id: that.data.detailPaymes.id
      },
      success: res => {
        console.log(res)
        if (res.data.state == 1){
          let data = res.data.data     
          wx.requestPayment({
            'timeStamp': data.timeStamp+'',
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
              
              wx.showModal({
                title: '提示',
                content: '支付成功',
                showCancel:false,
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../orderList/orderList?index='
                    })
                  }
                }
              })
            },
            'fail': function (res) {  
              wx.showModal({
                title: '提示',
                content: '支付失败',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../orderList/orderList?index='
                    })
                  }
                }
              })
            },
            'complete':function(){
              wx.hideLoading()
            }
          })
        } else if (res.data.status == 0){
          wx.hideLoading()
          app.globalData.pup(res.data.msg)
          
        }
      },
      fail(){
        wx.hideLoading()
      }
    })
  },
  orderminus(){ //商品减减

  },
  orderadd(){  //商品加加

  },
  againsttime(){//倒计时 

    let countdown = 60;
    let that = this
    function settime() {
      if (countdown == 0) {
        that.setData({
          againstSetTime: {
            name_: '重新获取',
            state: false
          }
        })
        return
      } else {
        countdown--
        that.setData({
          againstSetTime:{
            name_: countdown+'s',
            state: true
          }
        })
      }
      setTimeout(function () { settime() }, 1000)
    }
    settime()
  },
  bindinputPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  bindinputverify(e){
    this.setData({
      verify: e.detail.value
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
  
  }

})