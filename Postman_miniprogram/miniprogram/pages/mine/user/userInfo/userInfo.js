// pages/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    adminPattern:null,
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
    wx.getStorage({
      key:'adminPattern',
      encrypt:true,
      success:res=>{
        this.setData({
          adminPattern:res.data
        })
      }
    })
  },
  //切换管理员模式
  changeStatus(){
    wx.showLoading({
      title:'切换中...'
    })
    wx.setStorage({
      key:'adminPattern',
      data:true,
      encrypt:true,
      success:res => {
        wx.hideLoading({
          success:res1=>{
            wx.navigateBack({
              success:()=>{
                wx.showToast({
                  title:'切换成功'
                })
              }
            })
          }
        })
      }
    })
  },
  changeStatus2(){
    wx.showLoading({
      title:'切换中...'
    })
    wx.setStorage({
      key:'adminPattern',
      data:false,
      encrypt:true,
      success:res => {
        wx.hideLoading({
          success:res1=>{
            wx.navigateBack({
              success:()=>{
                wx.showToast({
                  title:'切换成功'
                })
              }
            })
          }
        })
      }
    })
  },
  //退出
  exit(){
    wx.showModal({
      title:"您正在退出",
      content:'确定要退出吗？',
      success:res=>{
        if (res.confirm){
          wx.removeStorageSync('userInfo')
          wx.setStorage({
            key:'adminPattern',
            data:false,
            encrypt:true
          })
          wx.switchTab({
            url:'/pages/mine/mine'
          })
        }
      }
    })
  },
})