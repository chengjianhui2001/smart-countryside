Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:0,
    cultural:[],
    activity:[],
    inform:[],
  },

  onLoad(options) {
    wx.showLoading({
      title:'数据加载中...'
    })
    this.getCulturalData(res=>{
      this.getActivityData(res=>{
        this.getInformData(res=>{
          wx.hideLoading()
        })
      })
    })
  },

  //路由至详细界面。
  // toDetail(){
  //   wx.navigateTo({
  //     url:'/pages/activity/detailActivity/detailActivity?fileId='
  //   })
  // },

  //监听切换页面
  onChange(event) {
    console.log(event.detail.name)
  },

  //获取文化类型的记录
  getCulturalData(callback){
    wx.cloud.callFunction({
      name:'getCultural',
      success:res => {
        console.log(res)
        this.setData({
          cultural:res.result.list
        },res=>{
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
  }
})