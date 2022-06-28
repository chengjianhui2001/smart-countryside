const db = wx.cloud.database()
const user = db.collection('user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    adminPattern:false
  },
  toUserInfo(){
    wx.navigateTo({
      url:'/pages/mine/user/userInfo/userInfo'
    })
  },
  //登录函数
  login(){
    wx.getUserProfile({
      desc: '用于登录智慧乡镇',
      success: res => {
        var userInfo = res.userInfo
        //设置局部用户信息
        this.setData({
          userInfo: userInfo
        })
        //将用户信息存入数据库
        user.where({
          _openid: wx.getStorageSync('_openid')
        }).get({
          success: res => {
            //原先没有添加，这里添加
            if (!res.data[0]) {
              userInfo.status = 'user'
              //将数据添加到数据库
              user.add({
                data: userInfo,
                success:res=>{
                  try {
                    userInfo._id = res._id
                    wx.setStorageSync('userInfo',userInfo)
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
              } catch (e) {
                console.log(e)
              }
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
  },
})