// pages/dailyLaw/makeAnswer/makeAnswer.js
const db = wx.cloud.database()
const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    openAnimate:"A",
    choose1:false,
    choose2:false,
    choose3:false,
    choose4:false,
    user_answers:[],
    questions_id:null,
    title:null,
    count:0,
    questions:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("初始化运行...")
    wx.showLoading({
      title:'数据加载中'
    })
    this.getData(res=>{
      wx.hideLoading()
    })
  },

  getData(callback){
    let start = new Date(new Date(new Date().getTime()).setHours(0,0,0,0));
    let end = new Date(new Date(new Date().getTime()).setHours(59,59,59,59));
    db.collection('law_question')
        .where(_.and([
          {
            create_time:_.gt(new Date(start))
          },
          {
            create_time:_.lt(new Date(end))
          },
        ]))
        .orderBy('create_time','desc')
        .limit(1)
        .get({
          success:res => {
            console.log(res)
            this.setData({
              questions_id:res.data[0]._id,
              title:res.data[0].title,
              count:res.data[0].count,
              questions:res.data[0].questions
            },res=>{
              callback()
            })
          }
        })
  },


  nextDB(){
    console.log('防抖')
    clearTimeout(this.TimeID);
    this.TimeID = setTimeout(() => {
      console.log('执行')
      this.next()
    }, 500);
  },

  submitDB(){
    console.log('防抖')
    clearTimeout(this.TimeID);
    this.TimeID = setTimeout(() => {
      console.log('执行')
      this.submit()
    }, 500);
  },

  chooseAnswer(e){},

  getValue(e){
    console.log(e)
    this.setData({
      [`user_answers[${this.data.index}]`]:e.detail.value
    },res=>{
      console.log(this.data.user_answers)
    })
  },

  next(){
    if (this.data.user_answers[this.data.index]===undefined){
      wx.showToast({
        title:"请选择一个答案",
        icon:"none"
      })
    }else {
      this.setData({
        openAnimate:"B"
      },res=>{
        setTimeout(res=>{
          this.setData({
            index:this.data.index+1,
            choose1:false,
            choose2:false,
            choose3:false,
            choose4:false,
          },res=>{
            setTimeout(res=>{
              this.setData({
                openAnimate:"A"
              })
            },1000)
          })
        },1000)
      })
    }
  },

  score:function(){
    let score = 0
    this.data.user_answers.forEach((item,index)=>{
      if (item===this.data.questions[index].answer){
        score = score + 20
      }
    })
    return score
  },

  submit(){
    if (this.data.user_answers[this.data.index]===undefined){
      wx.showToast({
        title:"请选择一个答案",
        icon:"none"
      })
    }else {
      wx.showLoading({
        title:'提交中'
      })
      let user_id = wx.getStorageSync('userInfo')._id
      let score = this.score()
      let data = {
        user_id:user_id,
        questions_id:this.data.questions_id,
        score:score,
        user_answers:this.data.user_answers,
        create_time:new Date()
      }
      console.log(data)
      db.collection('use_relate_law_question').add({
        data: {
          user_id: user_id,
          questions_id: this.data.questions_id,
          title:this.data.title,
          score: score,
          user_answers: this.data.user_answers,
          create_time: new Date(),
          create_time_show:this.TimeFormat(new Date())
        },
        success:res=>{
          wx.redirectTo({
            url:'/pages/dailyLaw/score/score?score='+score+'&questions='+JSON.stringify(this.data.questions)+'&user_answers='+JSON.stringify(this.data.user_answers),
            success:res1 => {
              wx.hideLoading()
            }
          })
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
  },

  //时间格式化
  TimeFormat(time){
    let date = new Date(time);
    let YY = date.getFullYear() + '-';
    let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD + " " + hh + mm + ss;
  },

})