// pages/dailyLaw/makeAnswer/makeAnswer.js
const db = wx.cloud.database()
const _ = db.command

Page({
  /**
   * 页面的初始数据
   */
  data: {
    score:0,
    index:0,
    isRight:null,
    isDisable:false,
    title:'每日普法',
    count:3,
    create_time:new Date(),
    questions:[
      {
        answer:"最高权力机构是股东大会",
        choose: ["最高权力机构是股东大会","最高决策机构是董事会","股东以出资额为限承担有限责任","有限责任和合伙制公司三类"],
        question:"关于公司制，下列说法正确的有："
      },
      {
        answer:"asdfafasf",
        choose: ["sdfsfsdf","sdfsdfsdfs","sfsdfsdfsd","sdfsdfsdf、sdfsdfsf"],
        question:"sdfs，dsdfsfsf："
      },
      {
        answer:"asdf12354124124afasf",
        choose: ["sdfsfs23423423423df","sdfs23423423423dfsdfs","sfsdf32424sdfsd","sdfs234242dfsdf、sdfsd234234234fsf"],
        question:"sdfs34234234，dsdfs2342342fsf："
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let start = this.timeFormat(new Date())+" 00:00:00"
    let end = this.timeFormat(new Date())+" 23:59:59"

    wx.showToast({
      icon:"none",
      title:"您只有一次选择的机会，请认真选择哦！",
      duration:2000
    })
    // db.collection('law_question')
    //     .where(_.and([
    //       {
    //         create_time:_.gt(new Date(start))
    //       },
    //       {
    //         create_time:_.lt(new Date(end))
    //       },
    //     ]))
    //     .orderBy('create_time','asc')
    //     .limit(1)
    //     .get({
    //       success:res => {
    //         console.log(res)
    //       }
    //     })
  },

  chooseAnswer(e){
    this.setData({
      isDisable:true
    })
    if (e.currentTarget.dataset.value===this.data.questions[this.data.index].answer) {
      this.animate(e.currentTarget.dataset.id, [
        {backgroundColor:'#0081ff !important'},
      ], 500,)
      setTimeout(res=>{
        this.animate('#answerCard',[
          {translateX:0},
          {translateX:150},
          {translateX:300},
          {translateX:450},
        ],3000)
      },1000)
      this.setData({
        isRight: "T",
        score:this.data.score+20
      })
    }
    else {
      this.animate(e.currentTarget.dataset.id, [
        { backgroundColor: '#e54d42 !important' },
      ], 2000, )
      this.setData({
        isRight:"F",
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