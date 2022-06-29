const utils = require("../../utils/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    cultural:[],
    activity:[],
    inform:[],
    isLoading:true
  },

  onLoad(options) {
    // wx.showLoading({
    //   title:'数据加载中...'
    // })
    this.getCulturalData(res=>{
      this.getActivityData(res=>{
        this.getInformData(res=>{
          this.setData({
            isLoading:false
          })
          // wx.hideLoading()
        })
      })
    })
  },

  //监听切换页面
  onChange(event) {},

  //获取文化类型的记录
  getCulturalData(callback){
    wx.cloud.callFunction({
      name:'getCultural',
      success:res => {
        console.log(res)
        this.setData({
          cultural:res.result.list
        },res=>{
          for (let index in this.data.cultural){
            this.setData({
              [`cultural[${index}].create_time`]:utils.timeFormat(this.data.cultural[index].create_time)
            })
          }
          callback()
        })
      }
    })
  },
  //获取活动类型的记录
  getActivityData(callback){
    wx.cloud.callFunction({
      name:'getActivity',
      success:res => {
        console.log(res)
        this.setData({
          activity:res.result.list
        },res=>{
          for (let index in this.data.activity){
            this.setData({
              [`activity[${index}].create_time`]:utils.timeFormat(this.data.activity[index].create_time)
            })
          }
          callback()
        })
      }
    })
  },
  //获取通知类型的记录
  getInformData(callback){
    wx.cloud.callFunction({
      name:'getInform',
      success:res => {
        console.log(res)
        this.setData({
          inform:res.result.list
        },res=>{
          for (let index in this.data.inform){
            this.setData({
              [`inform[${index}].create_time`]:utils.timeFormat(this.data.inform[index].create_time)
            })
          }
          callback()
        })
      }
    })
  },

  //下拉刷新
  onPullDownRefresh() {
    wx.showLoading({
      title:'刷新中...'
    })
    this.getCulturalData(res=>{
      this.getActivityData(res=>{
        this.getInformData(res=>{
          wx.stopPullDownRefresh()
          wx.hideLoading()
        })
      })
    })
  },
  //详情页
  toDetails(e){
    let fileId = e.currentTarget.dataset.fileid
    let title = e.currentTarget.dataset.title
    console.log(fileId,title)
    wx.navigateTo({
      url:'/pages/information/detailInformation/detailInformation?fileId='+fileId+'&title='+title
    })
  }
})