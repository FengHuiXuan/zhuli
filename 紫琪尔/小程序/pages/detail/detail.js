// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    getuserInfobtn:false,
    services:"",
    tabbar:2,
    service_content:'',
    service_notice:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    app.globalData.httprequest('servicesDetail',{
      data:{
        'services_id': options.id
      },
      success: res => {
        console.log(res)
        if (res.data.state == 1){
          let service_content = WxParse.wxParse('service_content', 'html', res.data.services.service_content, that, 5);
          let service_notice =  WxParse.wxParse('service_notice', 'html', res.data.services.service_notice, that, 5);
          that.setData({
            services: res.data.services,
            service_content: service_content,
            service_notice: service_notice
          })
        }
      },
      complete:res => {
        wx.hideLoading()
      }
    })
  },
  getUserInfo(res) {
    if (res.detail.userInfo) {
      wx.setStorageSync('userInfo', res.detail.userInfo)
      this.setData({
        getuserInfobtn: false
      })
      app.globalData.logins(res => {
      
      })
    }
  },
  previewImg(e){//预览图片
    wx.previewImage({
      current: e.currentTarget.dataset.previewimg, 
      urls: [e.currentTarget.dataset.previewimg] 
    })
  },
  detail_tab(e){
    let index = e.currentTarget.dataset.index
    let that = this
    that.setData({
      tabbar: index
    })
  },
  qianggou(){//立即抢购
    if (wx.getStorageSync('userInfo')){
      app.globalData.detailPay = this.data.services
      wx.navigateTo({
        url: '../detailPay/detailPay'
      })
    }else{
      this.setData({
        getuserInfobtn: true
      })
    }
   
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
  
  }
})