// pages/dailyLaw/score/score.js
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
    console.log("23141412341144",options)
    this.setData({
      score:parseInt(options.score),
      questions:JSON.parse(options.questions),
      user_answers:JSON.parse(options.user_answers)
    })
  },

})