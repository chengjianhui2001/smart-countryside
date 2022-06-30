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

    toMakeAnswer(){
        let userInfo = wx.getStorageSync('userInfo')
        if (userInfo){
            wx.navigateTo({
                url:"/pages/dailyLaw/makeAnswer/makeAnswer"
            })
        }else {
            wx.showModal({
                title:'提示',
                content:'参与答题功能需要登录后才能使用，请您确认登录',
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
    },

  timeFormat(time){
    let date = new Date(time);
    let YY = date.getFullYear() + '-';
    let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return YY + MM + DD;
  }
})