// pages/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo===""){
      this.setData({
        userInfo:null
      })
    }else {
      this.setData({
        userInfo:userInfo
      })
    }
  },
  //退出
  exit(){
    wx.showModal({
      title:"您正在退出",
      content:'确定要退出吗？',
      success:res=>{
        if (res.confirm){
          wx.removeStorageSync('userInfo')
          wx.switchTab({
            url:'/pages/mine/mine'
          })
        }
      }
    })
  },
})