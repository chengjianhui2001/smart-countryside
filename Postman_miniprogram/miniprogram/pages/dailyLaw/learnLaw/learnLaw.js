const app = getApp()

Page({
    data: {
        isLoading: true,
        article: {},
    },

    onLoad: function (options) {
        const _ts = this;
        wx.cloud.getTempFileURL({
            fileList: ['cloud://cloud1-5g1oimlb11d4eb78.636c-cloud1-5g1oimlb11d4eb78-1312470390/activity/md/md_1656440514634.md'],
            success: res => {
                // get temp file URL
                console.log('得到临时链接',res.fileList[0].tempFileURL)
                this.getText(res.fileList[0].tempFileURL,res => {
                    let obj = app.towxml(res.data,'markdown',{
                        // theme:'dark',
                        events:{
                            tap:e => {
                                console.log('tap',e);
                            },
                            change:e => {
                                console.log('todo',e);
                            }
                        }
                    });
                    _ts.setData({
                        article:obj,
                        isLoading: false
                    });
                });
            },
            fail: err => {
                // handle error
                console.log(err)
            }
        })
    },

    //声明一个数据请求方法
    getText: (url, callback) => {
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                if (typeof callback === 'function') {
                    callback(res);
                }
            }
        });
    },

    //分享给微信好友
    onShareAppMessage:function (){
        let shareObj;
        return shareObj = {
            title:'快乐普法',
            path:'/pages/dailyLaw/learnLaw/learnLaw',
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
            title:'快乐普法',
            path:'/pages/dailyLaw/learnLaw/learnLaw',
        }
    },
});