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
    let start = this.timeFormat(new Date())+" 00:00:00"
    let end = this.timeFormat(new Date())+" 23:59:59"
    db.collection('use_relate_law_question')
        .where(_.and([
          {
            create_time:_.gt(new Date(start))
          },
          {
            create_time:_.lt(new Date(end))
          },
        ]))
        .field({
          score: true,
        })
        .orderBy('score', 'desc')
        .limit(1)
        .get({
          success:res => {
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