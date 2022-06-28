const utils = require('../../../utils/index')
const db = wx.cloud.database()

Page({
  data: {
    list:[],
    isLoading:true
  },

  //初始化页面
  onShow:function (options) {
    this.getData(res=>{
      this.setData({
        isLoading:false
      })
    })
  },

  //获取所有信息
  getData(callback){
    let user_id = wx.getStorageSync('userInfo')._id
    wx.cloud.callFunction({
      name:'getAllInformation',
      data:{
        user_id:user_id
      },
      success:res=>{
        console.log(res)
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
      }
    })
  },

  //删除信息
  handleDelete(e){
    let _id = e.currentTarget.dataset.id
    let coverId = e.currentTarget.dataset.cover_id
    let fileId = e.currentTarget.dataset.file_id
    wx.showModal({
      title:'提示',
      content:'删除后无法数据无法恢复，你确定要删除吗？',
      success:res=>{
        if (res.confirm){
          wx.showLoading({
            title:'删除中...'
          })
          db.collection('activity').doc(_id).remove().then(res=>{
            wx.cloud.deleteFile({
              fileList: [coverId,fileId],
              success: res => {
                this.getData(res=>{
                  wx.hideLoading()
                  console.log('数据更新成功')})
                  console.log(res)
              },
              fail: err => {
                console.log(err)
              },
            })
          })
        }
      }
    })
  },

  //下拉刷新
  onPullDownRefresh(){
    wx.showLoading({
      title:'数据加载中...'
    })
    this.getData(res=>{
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  //带参跳转编辑页面
  handleUpdate(e){
    let info = e.currentTarget.dataset.info
    wx.navigateTo({
      url:'/pages/information/editInformation/editInformation?info='+JSON.stringify(info)
    })
  }
})