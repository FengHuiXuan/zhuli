// pages/comment/comment.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

  },
  submitp(){
    console.log(1)
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
      }
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
        let arr = res.tempFilePaths
        let arr2 = that.data.imglist.concat(...arr)
        if (arr2.length > 9){
          arr2.length = 9
          wx.showToast({
            title: '最多上传9张图片',
            icon: 'none',
            duration: 2000
          })
        }
        that.setData({
          imglist: arr2
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