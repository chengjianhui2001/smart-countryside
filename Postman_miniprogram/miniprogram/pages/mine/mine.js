// pages/mine/mine.js
const db = wx.cloud.database()
const user = db.collection('user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
  },

  //登录函数
  login(){
    wx.getUserProfile({
      desc: '用于登录智慧乡镇',
      success: res => {
        //设置局部用户信息
        this.setData({
          userInfo: res.userInfo
        },res=>{
          console.log('设置局部页面用户信息',this.data.userInfo)
        })
        //将用户信息存入数据库
        user.where({
          _openid: wx.getStorageSync('_openid')
        }).get({
          success: res => {
            console.log("登录后判断数据中是否含有用户信息，如果有则将用户信息设置全局。",res)
            //原先没有添加，这里添加
            if (!res.data[0]) {
              //将数据添加到数据库
              user.add({
                data: this.data.userInfo,
                success:res=>{
                  console.log("获取新增用户的信息的用户id",res)
                  try {
                    let userInfo = this.data.userInfo
                    userInfo._id = res._id
                    wx.setStorageSync('userInfo',userInfo)
                    console.log("缓存新用户信息成功")
                  } catch (e) { console.log(e) }
                }
              })
            } else {
              //数据库中已经存在该openID
              this.setData({
                userInfo: res.data[0]
              })
              try {
                wx.setStorageSync('userInfo', res.data[0])
                console.log('缓存userInfo',wx.getStorageSync('userInfo'))
              } catch (e) { console.log(e) }
            }
          }
        })
      }
    })
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