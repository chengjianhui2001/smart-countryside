const app = getApp()

Page({
    data: {
        isLoading: true,
        article: {}
    },

    onLoad: function (options) {
        const _ts = this;
        let fileId = options.fileId
        wx.cloud.getTempFileURL({
            fileList: [fileId],
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
    }
});