// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableData: {
      username:null,
      createTime:null,
      title:null,
      content:null,
    },
    d: {},
  },

  // isCard
  isCard(e) {
    console.log(e.detail.value)
    this.setData({
      isCard: e.detail.value
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function () {
    console.log("下拉刷新")
    wx.cloud.callFunction({
      name:'getDateTime',
      success:res => {
        console.log("请求成功")
        console.log(res)
        this.setData({
          d:res.result
        })
        console.log(this.data.d)
        wx.stopPullDownRefresh()
      }
    })
  },

})