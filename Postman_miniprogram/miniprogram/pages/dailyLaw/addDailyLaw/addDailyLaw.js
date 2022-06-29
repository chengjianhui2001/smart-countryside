// pages/mine/admin/addDailyLaw/addDailyLaw.js
const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isCreated:false,
    title:null,
    count:5,
    index:0,
    isSubmit:false,
    //用于存储问题数组
    questions:[],
    question:null,
    choose1:null,
    choose2:null,
    choose3:null,
    choose4:null,
    option1:false,
    option2:false,
    option3:false,
    option4:false,
    answer:null,
  },
  //创建题目集
  create(){
    if (!this.data.title){
      wx.showToast({
        title:'请输入题集名称',
        icon:"none"
      })
    }else {
      if (this.data.count>=10 ||this.data.count<3){
        wx.showToast({
          title:'数量为3-10',
          icon:"none"
        })
      }else {
        wx.showLoading({
          title:'玩命加载中...'
        })
        setTimeout(res=>{
          this.setData({
            isCreated:true
          },res=>{
            wx.hideLoading()
          })
        },1000)
      }
    }
  },

  //bind:input="handleInput"
  handleInput(e){},

  //获取答案
    getAnswer:function (){
    if (this.data.option1 && !this.data.option2 && !this.data.option3 && !this.data.option4){
      this.setData({
        answer:this.data.choose1
      })
    }else if (!this.data.option1 && this.data.option2 && !this.data.option3 && !this.data.option4){
      this.setData({
        answer:this.data.choose2
      })
    }else if (!this.data.option1 && !this.data.option2 && this.data.option3 && !this.data.option4){
      this.setData({
        answer:this.data.choose3
      })
    }else if (!this.data.option1 && !this.data.option2 && !this.data.option3 && this.data.option4){
      this.setData({
        answer:this.data.choose4
      })
    }
    return this.data.answer
  },

  //next
  next(){
    let question = {
      question:this.data.question,
      choose:[this.data.choose1,this.data.choose2,this.data.choose3,this.data.choose4],
      answer:this.data.answer
    }
    if (!question.question){
      wx.showToast({
        title:'请将题目填写完整!',
        icon:"none"
      })
    }else if (!question.choose[0] || !question.choose[1] || !question.choose[2] || !question.choose[3]){
      wx.showToast({
        title:'请将选项填写完整!',
        icon:"none"
      })
    }else if (!question.choose[1]){
      wx.showToast({
        title:'请将选项填写完整!',
        icon:"none"
      })
    }else if (!question.choose[2]){
      wx.showToast({
        title:'请将选项填写完整!',
        icon:"none"
      })
    }else if (!question.choose[3]){
      wx.showToast({
        title:'请将选项填写完整!',
        icon:"none"
      })
    }else if (!this.getAnswer()){
      wx.showToast({
        title:'请选择一个正确答案!',
        icon:"none"
      })
    }else {
      question.answer = this.data.answer
      console.log(question)
      this.setData({
        [`questions[${this.data.index}]`]:question
      },res=>{
        this.setData({
          index:this.data.index+1
        },res=>{
          this.setData({
            question:null,
            choose1:null,
            choose2:null,
            choose3:null,
            choose4:null,
            option1:false,
            option2:false,
            option3:false,
            option4:false,
            answer:null,
          },()=>{
            if (this.data.index===this.data.count){
              this.setData({
                isSubmit:true
              })
              console.log('到达提交页面！')
            }
          })
          console.log(this.data.index)
          console.log(`这是第${this.data.index}个问题`,this.data.questions[this.data.index-1])
        })
      })
    }
  },

  //提交
  submit(){
    wx.showLoading({
      title:'发布中...'
    })
    let user_id = wx.getStorageSync('userInfo')._id
    db.collection('law_question').add({
      data:{
        user_id:user_id,
        title:this.data.title,
        count:this.data.count,
        questions:this.data.questions,
        create_time:new Date(),
      },
      success:res=>{
        console.log('发表每日答题',res)
        wx.hideLoading()
        if (res.errMsg==="collection.add:ok"){
          wx.switchTab({
            url:'/pages/mine/mine',
            success:res1 => {
              wx.showToast({
                title:'发布成功'
              })
            }
          })
        }
      },
      fail:res=>{
        console.log(res)
      }
    })
  },
})