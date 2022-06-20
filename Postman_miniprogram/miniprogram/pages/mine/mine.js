// pages/mine/mine.js
const app = getApp()
const db = wx.cloud.database()
const user = db.collection('user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
  },

  /**
   * 登录函数
   */
  login(){
    wx.getUserProfile({
      desc: '用于登录智慧乡镇',
      success: res => {
        console.log(res.userInfo)
        //设置全局用户信息
        app.globalData.userInfo = res.userInfo
        //设置局部用户信息
        this.setData({
          userInfo: res.userInfo
        })
        //将用户信息存入数据库
        user.where({
          _openid: app.globalData.user_openid
        }).get({
          success: res => {
            //原先没有添加，这里添加
            if (!res.data[0]) {
              //将数据添加到数据库
              user.add({
                data: this.data.userInfo,
              }).then(res=>{
                console.log(res);
              })
            } else {
              //数据库中已经存在该openID
              this.setData({
                userInfo: res.data[0]
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
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


})