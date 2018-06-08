// pages/home/home.js

let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeList:[],
    homeListye:1,
    homemessage:"正在加载...",
    listbottom:false,
    listbanerLise:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    app.globalData.httprequest('servicesList',{
      data:{
        page: that.data.homeListye
      },
      success: res => {
        let data = res.data
        if (data.state == 1) {
         
          that.setData({
            homeListye: data.next_page,
            homeList: data.services_list,
            listbanerLise: data.banner_list
          })
        } else if (res.data.state == 0) {
          that.setData({
            homemessage: res.data.message
          })
        }
      },
      complete: res => {
        that.setData({
          listbottom:false
        })
      }
    })
  
  },
  previewImg(e){

    let activityData = e.currentTarget.dataset.previewimg
    app.globalData.activityparticulars = activityData
    if (activityData.content != ''){
 
      wx.navigateTo({
        url: '../shopsite/shopsite'
      })
      return
    }
    if (activityData.url != '') {
      wx.navigateTo({
        url: '../index/index?http=' + activityData.url
      })
    }
    
    
  },
  shopSite(e){ //跳转地图页面
    // wx.navigateTo({
    //   url:'../shopsite/shopsite'
    // }),

    var latitude = 40.0898549448
    var longitude = 116.5356355906
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: '紫琪尔国际丰胸美容机构（祥云小镇轻奢店）',
      scale: 10,
      address: '安泰大街9号院祥云小镇8号楼10层1001室',
      scale: 28
    })
  },
  homePhone(){ //电话
    wx.makePhoneCall({
      phoneNumber: '010-80491370' //仅为示例，并非真实的电话号码
    })
  },
  detailpage(e){  //服务详情页
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../detail/detail?id="+id
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
   * 页面相关事件处理函数--监听用户下拉动作
   */

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {  //上啦加载
    let that = this
    if(that.data.listbottom) return 
    that.setData({
      listbottom: true
    })
    app.globalData.httprequest('servicesList', {
      data: {
        page: that.data.homeListye
      },
      success: res => {
        if (res.data.state == 1){
          let arr = that.data.homeList.concat(res.data.services_list)
          that.setData({
            homeListye: res.data.next_page,
            homeList: arr
          })
        } else if (res.data.state == 0) {
          that.setData({
            homemessage: res.data.message,
          })
        }
      },
      complete: res => {
        that.setData({
          listbottom: false
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})