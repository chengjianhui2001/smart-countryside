// pages/dailyLaw/details/details.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0,
    questions:[],
    user_answers:[],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id)
    wx.cloud.callFunction({
      name:'getQuesDetailById',
      data:{
        id:options.id
      },
      success:res=>{
        console.log(res)
        this.setData({
          score:res.result.list[0].score,
          questions:res.result.list[0].details[0].questions,
          user_answers:res.result.list[0].user_answers
        })
      }
    })
  },
})