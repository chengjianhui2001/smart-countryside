const utils = require("../../../utils/index");
const db = wx.cloud.database()

Page({
    data: {
        list:[],
        isLoading:true,
    },

    onShow(){
        this.getData(res=>{
            this.setData({
                isLoading:false
            })
        })
    },

    getData(callback){
        let user_id = wx.getStorageSync('userInfo')._id
        wx.cloud.callFunction({
            name:'getAllMoment',
            success:res => {
                console.log(res)
                this.setData({
                    list:res.result.list
                },res=>{
                    for (let index in this.data.list){
                        this.setData({
                            [`list[${index}].create_time`]:utils.timeFormat(this.data.list[index].create_time)
                        })
                    }
                    callback()
                })
            }
        })
    },

    //删除
    handleDelete(e){
        console.log(e)
        let _id = e.currentTarget.dataset.id
        let fileList = e.currentTarget.dataset.fileids
        wx.showModal({
            title:'提示',
            content:'删除后数据无法恢复，您确定要删除吗？',
            success:result => {
                if (result.confirm){
                    console.log(fileList)
                    wx.showLoading({
                        title:'删除中...'
                    })
                    db.collection('moment').doc(_id).remove({
                        success:res => {
                            wx.cloud.deleteFile({
                                fileList: fileList,
                                success: res => {
                                    console.log('成功删除记录和图片',res.fileList)
                                    this.getData(res=>{
                                        wx.hideLoading()
                                    })
                                },
                                fail: err => { console.log(err) },
                            })
                        }
                    })
                }
            }
        })
    },

    //查看
    handleRead(e){
        let info = e.currentTarget.dataset.moment
        wx.navigateTo({
            url:'/pages/moments/detailMoment/detailMoment?info='+JSON.stringify(info)
        })
    },

    //下拉刷新
    onPullDownRefresh(){
        wx.showLoading({
            title:'数据加载中',
        })
        this.getData(res=>{
            wx.hideLoading()
            wx.stopPullDownRefresh()
        })
    }
});