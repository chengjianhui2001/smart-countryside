// pages/dailyLaw/makeAnswer/makeAnswer.js
const db = wx.cloud.database()
const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoading:true,
    index:0,
    openAnimate:"A",
    choose1:false,
    choose2:false,
    choose3:false,
    choose4:false,
    user_answers:[],

    questions_id:'',
    title:'',
    count:0,
    questions:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getData(res=>{
      this.setData({
        isLoading:false
      })
    })
  },

  getData(callback){
    let start = new Date(new Date(new Date().getTime()).setHours(0,0,0,0));
    let end = new Date(new Date(new Date().getTime()).setHours(23,59,59,59));
    console.log(start,end);
    db.collection('law_question')
        .where(_.and([
          {
            create_time:_.gt(new Date(start))
          },
          {
            create_time:_.lt(new Date(end))
          },
        ]))
        .orderBy('create_time','asc')
        .limit(1)
        .get({
          success:res => {
            console.log(res)
            if (res.data.length===0){
              callback()
            }else{
              this.setData({
                questions_id: res.data[0]._id,
                title: res.data[0].title,
                count: res.data[0].count,
                questions: res.data[0].questions
              },res=>{
                callback()
              })
            }
          }
        })
  },


  submitDB(){
    wx.showLoading({
      title:'提交中...'
    })
    console.log('持续点击')
    clearTimeout(this.TimeID);
    this.TimeID = setTimeout(() => {
      console.log('执行')
      this.submit()
    }, 500);
  },

  chooseAnswer(e){},

  getValue(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      [`user_answers[${index}]`]:e.detail.value
    })
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

  isEmpty(){
    let flag = true
    if (this.data.user_answers.length===0){
      flag = false
    }else if (this.data.user_answers.length!==this.data.count){
      flag = false
    }else{
      for (let item of this.data.user_answers){
        if (item === undefined){
          flag = false
        }
      }
    }
    return flag
  },

  submit(){
    if (!this.isEmpty()){
      wx.showToast({
        icon:'none',
        title:`请将答案选择完整后在提交！`
      })
    }else {
      let user_id = wx.getStorageSync('userInfo')._id
      let score = this.score()
      let data = {
        user_id: user_id,
        questions_id: this.data.questions_id,
        score: score,
        user_answers: this.data.user_answers,
        create_time: new Date()
      }
      db.collection('use_relate_law_question').add({
        data: {
          user_id: user_id,
          questions_id: this.data.questions_id,
          title:this.data.title,
          score: score,
          user_answers: this.data.user_answers,
          create_time: new Date(),
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


  /*nextDB(){
  console.log('持续点击')
  clearTimeout(this.TimeID);
  this.TimeID = setTimeout(() => {
    console.log('执行')
    this.next()
  }, 500);
},*/

  /*next(){
  if (!this.data.user_answers[this.data.index]){
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
},*/
})