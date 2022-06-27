// pages/home/home.js
const utils = require('../../utils/index')
const db = wx.cloud.database()
const news = db.collection('news')
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    inputValue:"",
  },

  /**
   * 渲染页面数据*/
  onShow:function (){
    this.getMoment(res=>{})
  },

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function () {
    this.getMoment(res=>{
      wx.stopPullDownRefresh()
      this.setData({
        inputValue:""
      })
    })

  },

  //模糊查询
  search(){
    wx.showLoading({
      title:'数据加载中'
    })
    if (this.data.inputValue===""){
      this.getData()
    }else {
      wx.cloud.callFunction({
        name:"searchNews",
        data:{
          inputValue:this.data.inputValue
        },
        success:res=>{
          this.setData({
            newsInfos:res.result.list
          },res=>{
            wx.hideLoading()
          })
          /*this.setData({
            newsInfos:
          })*/
        },
        fail:res=>{
          console.log(res)
        }
      })
    }
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
})