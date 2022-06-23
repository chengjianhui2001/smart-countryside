// pages/home/home.js
const db = wx.cloud.database()
const news = db.collection('news')
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsInfos:[],
    inputValue:"",
  },

  /**
   * 渲染页面数据*/
  onShow:function (){
    this.getData()
  },

  /**
   * 无条件查询*/
  getData:function(callback){
    if (!callback){
      callback = res=>{}
    }
    wx.showLoading({
      title:'数据加载中'
    })
    wx.cloud.callFunction({
      name:'getNewsData',
      success:res => {
        // let oldNewsInfos = this.data.newsInfos
        this.setData({
          // newsInfos:oldNewsInfos.concat(res.result),
          newsInfos:res.result.list
        },res=>{
          // this.pageData.skip = this.pageData.skip + 100
          wx.hideLoading()
          callback()
        })
      },
      fail:res=>{
        console.log(res)
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function () {
    this.getData(res=>{
      wx.stopPullDownRefresh()
      this.setData({
        inputValue:""
      })
    })

  },

  //模糊查询
  search(){
    wx.showLoading({
      title:'数据加载中'
    })
    if (this.data.inputValue===""){
      this.getData()
    }else {
      wx.cloud.callFunction({
        name:"searchNews",
        data:{
          inputValue:this.data.inputValue
        },
        success:res=>{
          this.setData({
            newsInfos:res.result.list
          },res=>{
            wx.hideLoading()
          })
          /*this.setData({
            newsInfos:
          })*/
        },
        fail:res=>{
          console.log(res)
        }
      })
    }
  },


  //监听搜索框输入
  inputChange(){
    // console.log(this.data.inputValue)
  },

  //监听卡片样式
  isCard(e) {
    this.setData({
      isCard: e.detail.value
    })
  },
})