// pages/userSettings/userSettings.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
  },

  exit(){
    wx.showModal({
      title:"您正在退出",
      content:'确定要退出吗？',
      success:res=>{
        if (res.confirm){
          app.globalData.userInfo = null
          wx.switchTab({
            url:'/pages/mine/mine'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      userInfo:app.globalData.userInfo
    })
  },


  /**
   * 客服消息
   * */
  handleContact(e){
    wx.cloud.callFunction({
      name:'contactMessage',
      data:e.detail.query,
      success: res => {
        console.log(res)
      }
    })
  }
})