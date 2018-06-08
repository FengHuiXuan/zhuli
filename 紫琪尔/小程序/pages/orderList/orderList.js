// pages/orderList/orderList.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList_tabbar:0,
    pup_up:true,
    spendcalendar:true,
    orderList:[],
    next_page:1,
    orderListState:false,
    nonelist:'',
    nonelists:false,
    consumptionCode:'',
    consumeRecord:true,
    consumptionRecord:true
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorageSync('3rd_session')
    let session3rd = null
    if (wx.getStorageSync('3rd_session')){
       session3rd = wx.getStorageSync('3rd_session')
    }
    let index = options.index-1
    if(index == -1){
      index = ''
    }
    if (index == 2) {
      index = 3
    } 
    wx.showLoading({
      title: '加载中'
    })
    this.httpRequ(index)

    this.setData({
      orderList_tabbar: options.index
    })
  },
  evaluate_(e){//去评价
    app.globalData.commentodel = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../comment/comment'
    })
  }, 
  orderList_rem(e){ //查看消费码
    this.setData({
      spendcalendar:false,
      consumptionRecord:false
    })
    let id = e.currentTarget.dataset.id
    let that = this
    app.globalData.httprequest('consCode',{
      data:{
        session3rd: wx.getStorageSync('3rd_session'),
        services_order_id:id
      },
      success: res => {
        console.log(res)
        if (res.data.state == 1){
          if (res.data.cons_code == ''){
            that.setData({
              consumptionRecord: false
            })
          }else{
            that.setData({
              consumptionRecord: true
            })
          }
          that.setData({
            consumptionCode: res.data
          })
          
        }
      }
    })
  }, 
  orderpay(e){ //
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    if (status == 0) { //取消订单
      this.cancelOrder(id, index)
    } else if (status == 3) { //再次购买
      let id = e.currentTarget.dataset.services_id
      console.log('再次购买',id)
      this.againPay(id, index)
    }
    
  },
  pay_delete(e){
    let status = e.currentTarget.dataset.status
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    if (status == 0){ //立即支付
      this.immediatelyPay(id, index)
    } else if (status == 4){ //删除
      this.deleteOrder(id, index)
    } else if (status == 3) { //查看消费记录
      this.consumptionRecordOrder(id, index)
    }
  },
  cancelOrder(id, index){ //取消订单
    let that = this 
    wx.showModal({
      title: '提示',
      content: '您真的要取消吗？',
      success: function (res) {
        if (res.confirm) {
          app.globalData.httprequest('cancelTransaction', {
            data: {
              session3rd: wx.getStorageSync('3rd_session'),
              services_order_id: id
            },
            success: res => {
              //取消成功
              console.log('取消成功',res)
              if (res.data.state == 1){
                let arr = that.data.orderList
                arr[index].status = 4
                that.setData({
                  orderList: arr
                })
              }
              
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })

  }, 
  consumptionRecordOrder(id, index){ //查看消费记录
    this.setData({
      spendcalendar: false,
      consumptionRecord: false
    })
    let that = this
    app.globalData.httprequest('consCode', {
      data: {
        session3rd: wx.getStorageSync('3rd_session'),
        services_order_id: id
      },
      success: res => {
        console.log(res)
        if (res.data.state == 1) {
          that.setData({
            consumptionCode: res.data
          })

        }
      }
    })
  },
  deleteOrder(id,index){ //删除订单
    let that = this 
    wx.showModal({
      title: '提示',
      content: '您真的要删除吗？',
      success: function (res) {
        if (res.confirm) {
          app.globalData.httprequest('delOrder', {
            data: {
              session3rd: wx.getStorageSync('3rd_session'),
              services_order_id: id
            },
            success: res => {
              if (res.data.state == 1) {
                let arr = that.data.orderList
                arr.splice(index, 1)
                that.setData({
                  orderList: arr
                })
              }
             
            }
          })
        } else if (res.cancel) {

        }
      }
    })
   
  },
  againPay(id){  //再次购买
    wx.navigateTo({
      url: "../detail/detail?id=" + id
    })
  },
  immediatelyPay(id,index){ //立即支付 
    let that = this 
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    app.globalData.httprequest('promptlyPayment', {
      data: {
        session3rd: wx.getStorageSync('3rd_session'),
        services_order_id: id
      },
      success: res => {
        if (res.data.state == 1) {
          let data = res.data.data
          wx.requestPayment({
            'timeStamp': data.timeStamp + '',
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function (res) {
              that.data.orderList[index].status = 1
              let arr = that.data.orderList
              that.setData({
                orderList: arr
              })
              wx.showToast({
                title: '支付成功',
                icon: 'none',
                duration: 2000
              })
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      },
      complete:res => {
        wx.hideLoading()
      }
    })
  },
  close_pup(){
    this.setData({
      spendcalendar:true
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  orderList_tabbar_li(e){ //导航栏
    let index = e.currentTarget.dataset.index
    if (this.data.orderList_tabbar == index) return
    let that = this
    that.setData({
      orderList_tabbar: index,
      next_page: 1
    })
    index = index-1
    if (index == -1) {
      index = ''
    }
    if (index == 2) {
      index = 3
    }
    wx.showLoading({
      title: '加载中'
    })
    that.setData({
      orderList: [],
      nonelist: '',
      nonelists:false
    })
    that.httpRequ(index)
  },
  httpRequ(index){
    let that = this
    let session3rd = null
    if (wx.getStorageSync('3rd_session')) {
      session3rd = wx.getStorageSync('3rd_session')
    }
    console.log(index)
    app.globalData.httprequest('servicesOrderList', {
      data: {
        session3rd: session3rd,
        status: index,
        page: that.data.next_page
      },
      success: res => {
        console.log(res)
        if (res.data.state == 1) {
          let arr = that.data.orderList.concat(res.data.order_list)
          
         
          that.setData({
            orderList: arr,
            next_page: res.data.next_page
          })
        } else if (res.data.state == 0) {
          that.setData({
            //nonelist: res.data.message
            nonelist: '没有更多',
            nonelists:true              
          })
        }
      },
      complete:res => {
        wx.hideLoading()
        that.setData({
          orderListState: false
        })
      }
    })
  },
  onReachBottom: function () {
    if (this.data.orderListState) return
    let that = this
    that.setData({
      orderListState: true,
      nonelist:""
    })
    let index = that.data.orderList_tabbar - 1
    if (index == -1) {
      index = ''
    }
    wx.showLoading({
      title: '加载中'
    })
    that.httpRequ(index)
  }
})