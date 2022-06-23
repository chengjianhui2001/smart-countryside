// pages/userSettings/userSettings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {},

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