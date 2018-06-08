// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
var { time} = require('../../utils/util.js');
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
    getuserInfobtn:true,
    services:"",
    tabbar:0,
    service_content:'',
    service_notice:"",
    evaluateList:[],
    noneevaluateList:'',
    next_page:1,
    noneevaluateListstate:false

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
          let abc = "<p data-index='1'>123</p>"
          let service_conten2t = WxParse.wxParse('abc', 'html',abc, that, 5);
          let service_content = WxParse.wxParse('service_content', 'html', res.data.services.service_content, that, 5);
          let service_notice =  WxParse.wxParse('service_notice', 'html', res.data.services.service_notice, that, 5);
          that.setData({
            services: res.data.services,
            service_content: service_content,
            service_notice: service_notice
          })
        } else if (res.data.state == 0){
          wx.showModal({
            title: '提示',
            content: res.data.message,
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
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
      
      app.globalData.logins(res =>{
        this.qianggou()
        this.setData({
          getuserInfobtn: false
        })
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
    
    if (index == 2) { //评论
      that.setData({
        next_page:1,
        evaluateList:[]
      })
      that.detailevaluateList()
    }
    that.setData({
      tabbar: index
    })
  },

  qianggou(){//立即抢购
    console.log(2, this.data.services)
    if (wx.getStorageSync('userInfo')){
      app.globalData.detailPay = this.data.services
      if (this.data.services){
        wx.navigateTo({
          url: '../detailPay/detailPay'
        })
      }
      
    }else{
      this.setData({
        getuserInfobtn: true
      })
    }
  },
  detailevaluateList(){
    let that = this
    if (that.data.noneevaluateListstate) return
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    app.globalData.httprequest('evaluateList', {
      data: {
        services_id: that.data.services.id,
        page: that.data.next_page
      },
      success: res => {
        console.log(res)
        if (res.data.state == 1) {
          let arr = res.data.orders_evaluate.map(item => {
            item.evaluate_time = time(item.evaluate_time)
            return item
          })
          let arrs = that.data.evaluateList.concat(arr)
          that.setData({
            evaluateList: arrs,
            next_page: res.data.next_page
          })
          console.log(arr)
        } else if (res.data.state == 0) {
          that.setData({
            noneevaluateList: '暂无评论'
          })
        }
      },
      complete(){
        wx.hideLoading()
        that.setData({
          noneevaluateListstate: false
        })
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
    console.log('触底了')
    if (this.data.tabbar == 2){
      this.detailevaluateList()
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})