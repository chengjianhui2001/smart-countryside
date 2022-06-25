// pages/dailyLaw/history/history.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos:[],
  },

    onLoad:function (){
        wx.showLoading({
            title:'数据加载中'
        })
        this.getData2().then(res=>{
            console.log("获取数据",res)
            this.setData({
                infos:res
            },res=>{
                wx.hideLoading()
            })
        })
    },

    select(e){
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url:'/pages/dailyLaw/details/details?id='+id
        })
    },

    handleDelete(e){
      let id = e.currentTarget.dataset.id
      wx.showModal({
          title:'您正在删除...',
          content:'删除后该记录无法恢复',
          success:res=>{
              if (res.confirm){
                  wx.showLoading({
                      title:'删除中...'
                  })
                  db.collection('use_relate_law_question').doc(id).remove({
                      success:res=>{
                          this.getData2().then(res=>{
                              this.setData({
                                  infos:res
                              },res=>{
                                  wx.hideLoading()
                              })
                          })
                      }
                  })
              }
          }
      })
    },

    onPullDownRefresh:function () {
      wx.showLoading({
          title:'数据加载中'
      })
      this.getData2().then(res=>{
          this.setData({
              infos:res
          },res=>{
              wx.stopPullDownRefresh()
              wx.hideLoading()
          })
      })
    },

    async getData2(){
        let count = await db.collection('use_relate_law_question').count()
        count = count.total
        let all = []
        for (let i=0;i<count;i+=20){
            let list = await db.collection('use_relate_law_question')
                .field({
                    title:true,
                    score: true,
                    create_time_show: true,
                })
                .orderBy('create_time', 'desc')
                .skip(i)
                .get()
            all = all.concat(list.data)
        }
        return all
    },
})