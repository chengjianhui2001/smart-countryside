const utils = require('../../../utils/index')

Page({
    data: {
        moment:null,
    },
    onLoad: function (options) {
        let moment = JSON.parse(options.info)
        this.setData({
            moment:moment
        },res=>{
            for (let index in this.data.list){
                this.setData({
                    'moment.create_time':utils.timeFormat(this.data.create_time)
                })
            }
        })
    },
    //浏览图片
    viewImages(e){
        wx.previewImage({
            urls:e.currentTarget.dataset.urls,
            current:e.currentTarget.dataset.url
        })
    },
    //分享给微信好友
    onShareAppMessage:function (){
        let shareObj;
        return shareObj = {
            title: `${this.data.moment.user[0].nickName}的时刻`,
            success: res => {
                console.log(res)
                if (res.errMsg === 'shareAppMessage:ok') {
                    console.log(res)
                }
            },
            fail: res => {
                // 转发失败之后的回调
                if (res.errMsg === 'shareAppMessage:fail cancel') {
                    // 用户取消转发
                    console.log(res)
                } else if (res.errMsg === 'shareAppMessage:fail') {
                    // 转发失败，其中 detail message 为详细失败信息
                    console.log(res)
                }
            },
        }
    },

    //分享朋友圈
    onShareTimeline(){
      let shareObj;
      return shareObj = {
          title: `${this.data.moment.user[0].nickName}的时刻`,
      }
    },
});