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
   detailPaymes:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this    
    that.setData({
      detailPaymes: app.globalData.detailPay
    })
    console.log(wx.getStorageSync('phone_state'))
    if (wx.getStorageSync('phone_state') == 0){
      // that.setData({
      //   popUpstate:true
      // })
    } else if (wx.getStorageSync('phone_state') == 1) {
      that.setData({
        popUpstate: false
      })
    }
  },
  acquire(){ //获取验证吗
    let phone = this.data.phone
    if (!isPoneAvailable(phone)){
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码'
      })
      return 
    }

  },
  submitPay(){ //提交
    let phone = this.data.phone
    let verify = this.data.verify
   
  },
  submitorder(){//提交订单
    let that = this
    app.globalData.httprequest('subServicesOrder',{
      data:{
        session3rd: wx.getStorageSync('3rd_session'),
        services_id: that.data.detailPaymes.id
      },
      success: res => {
        if (res.data.status == 1){   
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
            }
          })
        }
      }
    })
  },
  orderminus(){ //商品减减

  },
  orderadd(){  //商品加加

  },
  bindinputPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  bindinputverify(){
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