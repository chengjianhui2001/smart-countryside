// pages/home/home.js
const utils = require('../../utils/index')
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    value:"",
    isCard:false,
    isLoading:true,
    isCancel:false
  },

  //渲染页面数据
  onShow:function (){
    this.getMoment(res=>{
      this.setData({
        isLoading:false
      })
    })
  },
  //获取数据
  getMoment(callback){
    wx.cloud.callFunction({
      name:'getMoments',
      success:res => {
        this.setData({
          list:res.result.list
        },res=>{
          for (let index in this.data.list){
            this.setData({
              [`list[${index}].create_time`]:utils.timeFormat(this.data.list[index].create_time)
            })
          }
          callback()
        })
      },
      fail:err => { console.log(err) }
    })
  },
  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh:function () {
    wx.showLoading({
      title:'刷新中...'
    })
    this.getMoment(res=>{
      wx.stopPullDownRefresh()
      wx.hideLoading()
      this.setData({
        inputValue:""
      })
    })
  },
  //模糊查询
  handleSearch(){
    console.log(this.data.value)
    if (this.data.value===''||this.data.value===undefined||this.data.value===false){
      wx.showToast({
        title:'请输入关键词后搜索哦！',
        icon:"none"
      })
    }else {
      wx.showLoading({
        title:'搜索中'
      })
      wx.cloud.callFunction({
        name:"searchMoments",
        data:{
          value:this.data.value
        },
        success:res=>{
          this.setData({
            list:res.result.list,
            isCancel:true
          },res=>{
            wx.hideLoading()
          })
        },
        fail:res=>{
          console.log(res)
        }
      })
    }
  },
  //取消搜索
  handleCancel(){
    wx.showLoading({
      title:'数据加载中...',
    })
    this.getMoment(()=>{
      this.setData({
        isCancel:false,
        value:""
      })
      wx.hideLoading()
    })
  },
  //监听搜索框输入
  inputChange(){
    // console.log(this.data.inputValue)
  },
  //监听卡片样式
  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },
  //浏览图片
  viewImages(e){
    wx.previewImage({
      urls:e.currentTarget.dataset.urls,
      current:e.currentTarget.dataset.url
    })
  },
  //去网详情页
  toDetail(e){
    let info = e.currentTarget.dataset.detailinfo
    wx.navigateTo({
      url:'/pages/moments/detailMoment/detailMoment?info='+JSON.stringify(info)
    })
  },
  //跳转至添加页
  toAdd(){
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo){
      wx.navigateTo({
        url:"/pages/moments/addMoment/addMoment"
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'发布时刻功能需要登录后才能使用，请您确认登录',
        success:result => {
          if (result.confirm){
            wx.getUserProfile({
              desc: '用于登录智慧乡镇',
              success: res => {
                var userInfo = res.userInfo
                //将用户信息存入数据库
                db.collection('user').where({
                  _openid: wx.getStorageSync('_openid')
                }).get({
                  success: res => {
                    //原先没有添加，这里添加
                    if (!res.data[0]) {
                      userInfo.status = 'user'
                      //将数据添加到数据库
                      db.collection('user').add({
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
          }else{
            console.log('取消登录')
          }
        },
        fail:(res)=>{
          console.log(res)
        }
      })
    }

  }
})