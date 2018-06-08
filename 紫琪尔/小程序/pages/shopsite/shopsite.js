// pages/shopsite/shopsite.js
var app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service_content:"",
    activityparticulars:"",
    shopstate:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let content = app.globalData.activityparticulars
    let service_content = WxParse.wxParse('service_content', 'html', content.content, this, 5);
    this.setData({
      service_content: service_content,
      activityparticulars: content
    })
    if (content.services_id == 0 && content.url == ''){
      this.setData({
        shopstate:false
      })
    }
    //app.globalData.httprequest()
  },
  lookContent(){
    let datas = this.data.activityparticulars
    console.log(datas )
    if (datas.services_id != 0){
      wx.navigateTo({
        url: '../detail/detail?id=' + datas.services_id
      })
      return
    } else if (datas.url){
      wx.navigateTo({
        url: '../index/index?http=' + datas.url
      })
    }
    
  },
  abcd(e){
    console.log(e)
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