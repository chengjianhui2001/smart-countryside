// pages/daliyLaw/dailyLaw.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:-1
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let start = new Date(new Date(new Date().getTime()).setHours(0,0,0,0));
    let end = new Date(new Date(new Date().getTime()).setHours(59,59,59,59));
    let user_id = wx.getStorageSync('userInfo')._id
    db.collection('use_relate_law_question')
        .where(_.and([
          {
            create_time:_.gt(start)
          },
          {
            create_time:_.lt(end)
          },
          {
            user_id:user_id
          }
        ]))
        .field({
          score: true,
          user_id: true
        })
        .orderBy('score', 'desc')
        .limit(1)
        .get({
          success:res => {
            console.log("当天最高分数的记录",res)
            if (res.data.length===0){
              this.setData({
                score:-1
              })
            }else {
              this.setData({
                score:res.data[0].score
              })
            }
          }

        })
  },

  timeFormat(time){
    let date = new Date(time);
    let YY = date.getFullYear() + '-';
    let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return YY + MM + DD;
  }
})