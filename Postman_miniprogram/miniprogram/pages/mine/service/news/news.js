// pages/contentMg/news/news.js
const db = wx.cloud.database()
const news = db.collection('news')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:null,
    nickName:null,
    gender:null,
    newsInfos:[],
  },

  getData:function(callback){
    let user_id = wx.getStorageSync('userInfo')._id
    if (!callback){
      callback = res=>{}
    }
    wx.showLoading({
      title:'数据加载中'
    })
    news.where({
      user_id:user_id
    })
    .orderBy('createTime', 'desc')
    .get({
      success:res => {
        console.log(res)
        // let oldNewsInfos = this.data.newsInfos
        this.setData({
          // newsInfos:oldNewsInfos.concat(res.result),
          newsInfos:res.data
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
  //进入页面渲染
  onShow:function() {
    try {
      let userInfo = wx.getStorageSync('userInfo')
      if (userInfo){
        this.getData()
        this.setData({
          avatarUrl:userInfo.avatarUrl,
          nickName:userInfo.nickName,
          gender:userInfo.gender
        })
      }
    }catch (e) {
      wx.showToast({
        title:'获取用户数据失败',
        icon:"error"
      })
      console.log(e)
    }
  },
  //删除我的新闻
  handleDelete(e){
    console.log(e)
    wx.showModal({
      title:'提示',
      content:'您正在删除当前记录...',
      cancelText:'再想想',
      confirmText:'确定删除',
      success:res=>{
        if (res.confirm){
          wx.showLoading({
            title:'删除中...'
          })
          news.doc(e.currentTarget.dataset.id).remove({
            success: res => {
              wx.cloud.deleteFile({
                fileList:e.currentTarget.dataset.filelist,
                success:res=>{
                  wx.hideLoading()
                  this.getData()
                },
                fail:res=>{
                  console.log("删除失败")
                },
              })
            }
          })
        }else {
          console.log('已取消')
        }
      },
      fail:res=>{
        console.log(res)
      }
    })
  },


  //编辑我的新闻
  handleUpdate(e){
    wx.navigateTo({
      url:'../../home/updateNews/updateNews?id='+e.currentTarget.dataset.id
    })
  }
})