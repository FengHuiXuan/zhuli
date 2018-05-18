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
    listbottom:false
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
        if (res.data.state == 1) {
          that.setData({
            homeListye: res.data.next_page,
            homeList: res.data.services_list
          })
        } else if (res.data.state == 0) {
          that.setData({
            homemessage: res.data.message
          })
        }
        
        console.log(res)
      },
      complete: res => {
        that.setData({
          listbottom:false
        })
      }
    })
  },
  homePhone(){
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },
  detailpage(e){
    console.log(e.currentTarget.dataset.id)
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
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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