Page({
    data: {
        newsId:null,
        newsInfo:{}
    },

    //带参路由初始化数据
    onLoad: function (options) {
        console.log(options)
        if (options.id){
            this.setData({
                newsId:options.id
            },res=>{
                this.getData()
            })
        }else {
            wx.showToast({
                title:'获取id失败',
                icon:"error"
            })
        }
    },

    //根据id获取数据
    getData(){
        wx.showLoading({
            title:'数据加载中'
        })
        wx.cloud.callFunction({
            name:'getNewsById',
            data:{
                newsId:this.data.newsId
            },
            success:res=>{
                this.setData({
                    newsInfo:res.result.list[0]
                },res=>{
                    wx.hideLoading()
                })
            },
            fail:res=>{
                console.log(res)
            }
        })
    }

});