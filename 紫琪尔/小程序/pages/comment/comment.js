// pages/comment/comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist:[],
    commentodel:'',
    reason:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.commentodel)
    this.setData({
      commentodel: app.globalData.commentodel
    })
  },
  submitp(){
    let that = this
    let reason = that.data.reason
    console.log(that.data.imglist)
    let imglistId = []
    imglistId = that.data.imglist.map(item => {
       return item.id
     })
    console.log(imglistId)
    app.globalData.httprequest('userEvaluate', {
      data: {
        'session3rd': wx.getStorageSync('3rd_session'),
        services_order_id: app.globalData.commentodel.id,
        evaluate: reason,
        pic_json: imglistId
      },
      success: res => {
        if (res.data.state == 1){
          wx.showToast({
            title: '评价成功',
            icon: 'none',
            duration: 2000
          })
          wx.redirectTo({
            url: '../orderList/orderList?index=""'
          })

        }

      }
    })
  },
  onInputContent(e) {
    if (e.detail.value == ''){
      wx.showToast({
        title: '评价不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    } 
  
    this.setData({
      reason: e.detail.value
    })
  },
  addImg(){
    let that = this
    console.log(that.data.imglist.length )
    if (that.data.imglist.length == 9) return
    wx.chooseImage({
      count:1,
      sizeType:'compressed',
      success(res){
        console.log(res)
      
        console.log(app.globalData.apis, res.tempFilePaths[0])
        wx.uploadFile({
          url: app.globalData.apis+ 'Ajax/upload', 
          filePath: res.tempFilePaths[0],
          name: 'files',
          success: function (res) {
            
            let datas = JSON.parse(res.data) 
            console.log(datas)
            if (datas.status){
              let arr = that.data.imglist
              arr.push(datas)
              if (arr.length > 9) {
                arr.length = 9
                wx.showToast({
                  title: '最多上传9张图片',
                  icon: 'none',
                  duration: 2000
                })
              }
              that.setData({
                imglist: arr
              })
            }
            
          }
        })
        
      }
    })
  },
  failDelete(e){
    let index = e.currentTarget.dataset.index
    let that = this
    that.data.imglist.splice(index, 1)
    that.setData({
      imglist: that.data.imglist
    })
    console.log()
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