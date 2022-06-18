// pages/login/login.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'; 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:null,
    password:null
  },

  login:function(){
    if (this.data.username !== null && this.data.password !== null){
      Toast.success('登录成功!')
      setTimeout(function(){
        wx.switchTab({
          url: '/pages/home/home',
        })
      },1000)
    }else{
      Toast.fail("密码错误！")
    }
  }
})