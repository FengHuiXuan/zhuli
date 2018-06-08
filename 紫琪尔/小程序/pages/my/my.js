// pages/my/my.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    userInfo:'',
    getuserInfobtn:false,
    servicesMinenum:{
      order_all:"*",
      order_enable: "*",
      order_evaluate: "*",
      order_payment: "*"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  orderAll(e){
    console.log(e.currentTarget.dataset.index)
    console.log('数据2', wx.getStorageSync('userInfo'))
    if (this.data.getuserInfobtn) return
    if (wx.getStorageSync('3rd_session')){
      let index = e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../orderList/orderList?index=' + index
      })
    }else{
      app.globalData.logins()
    }

  }, 
  getUserInfo(res){
    let that = this
    if (res.detail.userInfo){
      wx.setStorageSync('userInfo', res.detail.userInfo)
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        getuserInfobtn: false
      })
      app.globalData.logins(res => {
        that.servicesMine()
      })
    }
  },
  servicesMine(){ //获取订单数
  let that = this
    app.globalData.httprequest('servicesMine',{
      data:{
        session3rd: wx.getStorageSync('3rd_session')
      },
      success(res){
        console.log(res)
        if (res.data.state == 1){
          that.setData({
            servicesMinenum:res.data.data
          })
        } else if (res.data.status == 0){
          app.globalData.pup(res.data.msg)
        }
      }
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

    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        getuserInfobtn: false
      })
      this.servicesMine()
    } else {
      this.setData({
        getuserInfobtn: true
      })
    }
    if (wx.getStorageSync('3rd_session')) {
      this.servicesMine()
    }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  
})